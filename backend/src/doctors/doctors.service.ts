import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AvailabilityDto,
  CreateDoctorDto,
  UpdateDoctorDto,
} from './dto/doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liste les médecins, avec filtres optionnels par spécialité et/ou centre.
   * Utilisé par le parcours de réservation ("médecins disponibles selon la
   * spécialité choisie").
   */
  findAll(filters: { specialtyId?: string; centerId?: string }) {
    return this.prisma.doctor.findMany({
      where: {
        specialtyId: filters.specialtyId || undefined,
        centerId: filters.centerId || undefined,
      },
      include: { specialty: true, center: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        specialty: true,
        center: true,
        availabilities: true,
        absences: { orderBy: { startDate: 'asc' } },
      },
    });
    if (!doctor) {
      throw new NotFoundException('Médecin introuvable.');
    }
    return doctor;
  }

  async create(dto: CreateDoctorDto) {
    await this.assertRefsExist(dto.specialtyId, dto.centerId);
    this.assertValidAvailabilities(dto.availabilities);

    return this.prisma.doctor.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        specialtyId: dto.specialtyId,
        centerId: dto.centerId,
        availabilities: dto.availabilities
          ? { create: dto.availabilities }
          : undefined,
      },
      include: { specialty: true, center: true, availabilities: true },
    });
  }

  async update(id: string, dto: UpdateDoctorDto) {
    await this.findOne(id);
    await this.assertRefsExist(dto.specialtyId, dto.centerId);
    this.assertValidAvailabilities(dto.availabilities);

    // On remplace l'ensemble des disponibilités si elles sont fournies.
    return this.prisma.doctor.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        specialtyId: dto.specialtyId,
        centerId: dto.centerId,
        availabilities: dto.availabilities
          ? { deleteMany: {}, create: dto.availabilities }
          : undefined,
      },
      include: { specialty: true, center: true, availabilities: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.doctor.delete({ where: { id } });
    return { deleted: true };
  }

  async setAvailabilities(id: string, availabilities: AvailabilityDto[]) {
    await this.findOne(id);
    this.assertValidAvailabilities(availabilities);
    await this.prisma.doctor.update({
      where: { id },
      data: { availabilities: { deleteMany: {}, create: availabilities } },
    });
    return this.prisma.availability.findMany({ where: { doctorId: id } });
  }

  private async assertRefsExist(specialtyId: string, centerId: string) {
    const [specialty, center] = await Promise.all([
      this.prisma.specialty.findUnique({ where: { id: specialtyId } }),
      this.prisma.center.findUnique({ where: { id: centerId } }),
    ]);
    if (!specialty) {
      throw new BadRequestException('Spécialité inexistante.');
    }
    if (!center) {
      throw new BadRequestException('Centre inexistant.');
    }
  }

  private assertValidAvailabilities(availabilities?: AvailabilityDto[]) {
    if (!availabilities) {
      return;
    }
    for (const a of availabilities) {
      if (a.startTime >= a.endTime) {
        throw new BadRequestException(
          `Plage horaire invalide (${a.startTime}-${a.endTime}) : l'heure de début doit précéder l'heure de fin.`,
        );
      }
    }
  }
}
