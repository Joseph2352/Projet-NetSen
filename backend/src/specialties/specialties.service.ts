import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpecialtyDto, UpdateSpecialtyDto } from './dto/specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liste les spécialités. Si `centerId` est fourni, ne renvoie que les
   * spécialités ayant au moins un médecin affecté à ce centre (utile pour
   * filtrer le parcours de réservation après le choix du centre).
   */
  findAll(centerId?: string) {
    return this.prisma.specialty.findMany({
      where: centerId
        ? { doctors: { some: { centerId } } }
        : undefined, // centerId vide → toutes les spécialités
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const specialty = await this.prisma.specialty.findUnique({ where: { id } });
    if (!specialty) {
      throw new NotFoundException('Spécialité introuvable.');
    }
    return specialty;
  }

  async create(dto: CreateSpecialtyDto) {
    try {
      return await this.prisma.specialty.create({ data: dto });
    } catch (e) {
      throw this.handleUniqueError(e);
    }
  }

  async update(id: string, dto: UpdateSpecialtyDto) {
    await this.findOne(id);
    try {
      return await this.prisma.specialty.update({ where: { id }, data: dto });
    } catch (e) {
      throw this.handleUniqueError(e);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.specialty.delete({ where: { id } });
    return { deleted: true };
  }

  private handleUniqueError(e: unknown): Error {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      return new ConflictException('Cette spécialité existe déjà.');
    }
    return e as Error;
  }
}
