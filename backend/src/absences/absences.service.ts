import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAbsenceDto } from './dto/absence.dto';

@Injectable()
export class AbsencesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(doctorId?: string) {
    return this.prisma.absence.findMany({
      where: { doctorId },
      include: { doctor: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async create(dto: CreateAbsenceDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: dto.doctorId },
    });
    if (!doctor) {
      throw new BadRequestException('Médecin inexistant.');
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end < start) {
      throw new BadRequestException(
        'La date de fin doit être postérieure ou égale à la date de début.',
      );
    }

    return this.prisma.absence.create({
      data: {
        doctorId: dto.doctorId,
        startDate: start,
        endDate: end,
        reason: dto.reason,
        note: dto.note,
      },
    });
  }

  async remove(id: string) {
    const absence = await this.prisma.absence.findUnique({ where: { id } });
    if (!absence) {
      throw new NotFoundException('Absence introuvable.');
    }
    await this.prisma.absence.delete({ where: { id } });
    return { deleted: true };
  }
}
