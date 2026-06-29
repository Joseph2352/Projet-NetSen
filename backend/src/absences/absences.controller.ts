import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AbsencesService } from './absences.service';
import { CreateAbsenceDto } from './dto/absence.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN) // la gestion des absences est réservée aux administrateurs
@Controller('absences')
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

  @Get()
  findAll(@Query('doctorId') doctorId?: string) {
    return this.absencesService.findAll(doctorId);
  }

  @Post()
  create(@Body() dto: CreateAbsenceDto) {
    return this.absencesService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.absencesService.remove(id);
  }
}
