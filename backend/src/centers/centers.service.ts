import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCenterDto, UpdateCenterDto } from './dto/center.dto';

@Injectable()
export class CentersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.center.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const center = await this.prisma.center.findUnique({ where: { id } });
    if (!center) {
      throw new NotFoundException('Centre introuvable.');
    }
    return center;
  }

  create(dto: CreateCenterDto) {
    return this.prisma.center.create({ data: dto });
  }

  async update(id: string, dto: UpdateCenterDto) {
    await this.findOne(id);
    return this.prisma.center.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.center.delete({ where: { id } });
    return { deleted: true };
  }
}
