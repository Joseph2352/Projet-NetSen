import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookAppointmentDto } from './dto/appointment.dto';
import {
  formatSlotLabel,
  generateDaySlots,
  isDoctorAbsentOn,
  SLOT_DURATION_MINUTES,
} from './slots.util';

export interface AvailableSlot {
  start: string; // ISO
  end: string; // ISO
  label: string; // "HH:mm"
}

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcule les créneaux réellement réservables d'un médecin pour une date :
   * plages de travail du jour, MOINS les absences, MOINS les créneaux déjà
   * réservés, MOINS les créneaux déjà passés.
   */
  async getAvailableSlots(
    doctorId: string,
    dateStr: string,
  ): Promise<AvailableSlot[]> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { availabilities: true, absences: true },
    });
    if (!doctor) {
      throw new NotFoundException('Médecin introuvable.');
    }

    const date = new Date(`${dateStr}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Date invalide.');
    }

    // Médecin absent toute la journée → aucun créneau.
    if (isDoctorAbsentOn(date, doctor.absences)) {
      return [];
    }

    const slots = generateDaySlots(date, doctor.availabilities);

    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);
    const booked = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        status: AppointmentStatus.BOOKED,
        startTime: { gte: dayStart, lte: dayEnd },
      },
      select: { startTime: true },
    });
    const bookedTimes = new Set(booked.map((b) => b.startTime.getTime()));

    const now = Date.now();
    return slots
      .filter(
        (s) => !bookedTimes.has(s.start.getTime()) && s.start.getTime() > now,
      )
      .map((s) => ({
        start: s.start.toISOString(),
        end: s.end.toISOString(),
        label: formatSlotLabel(s.start),
      }));
  }

  /** Réserve un créneau pour le patient courant. */
  async book(patientId: string, dto: BookAppointmentDto) {
    const start = new Date(dto.startTime);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('Créneau invalide.');
    }
    if (start.getTime() <= Date.now()) {
      throw new BadRequestException('Impossible de réserver un créneau passé.');
    }

    const dateStr = start.toISOString().slice(0, 10);

    // On revérifie côté serveur que le créneau est bien proposé (sécurité :
    // on ne fait pas confiance aux données envoyées par le client).
    const available = await this.getAvailableSlots(dto.doctorId, dateStr);
    const match = available.find((s) => s.start === start.toISOString());
    if (!match) {
      throw new ConflictException(
        "Ce créneau n'est plus disponible. Veuillez en choisir un autre.",
      );
    }

    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60_000);

    // Transaction : on revérifie l'absence de double réservation juste avant
    // l'insertion, pour limiter les conditions de course.
    return this.prisma.$transaction(async (tx) => {
      const clash = await tx.appointment.findFirst({
        where: {
          doctorId: dto.doctorId,
          startTime: start,
          status: AppointmentStatus.BOOKED,
        },
      });
      if (clash) {
        throw new ConflictException('Ce créneau vient d’être réservé.');
      }
      return tx.appointment.create({
        data: {
          doctorId: dto.doctorId,
          patientId,
          startTime: start,
          endTime: end,
        },
        include: {
          doctor: { include: { specialty: true, center: true } },
        },
      });
    });
  }

  /** Rendez-vous du patient courant. */
  findMine(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      include: { doctor: { include: { specialty: true, center: true } } },
      orderBy: { startTime: 'desc' },
    });
  }

  /** Tous les rendez-vous (administration). */
  findAll() {
    return this.prisma.appointment.findMany({
      include: {
        doctor: { include: { specialty: true, center: true } },
        patient: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  /**
   * Annule un rendez-vous. Un patient ne peut annuler que ses propres RDV ;
   * un admin peut annuler n'importe lequel.
   */
  async cancel(id: string, requester: { id: string; role: Role }) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Rendez-vous introuvable.');
    }
    if (
      requester.role !== Role.ADMIN &&
      appointment.patientId !== requester.id
    ) {
      throw new ForbiddenException(
        "Vous ne pouvez annuler que vos propres rendez-vous.",
      );
    }
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Ce rendez-vous est déjà annulé.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELLED },
    });
  }
}
