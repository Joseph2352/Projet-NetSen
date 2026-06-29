import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AppointmentsService } from './appointments.service';
import { BookAppointmentDto, GetSlotsDto } from './dto/appointment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /** Créneaux disponibles d'un médecin pour une date donnée. */
  @Get('slots')
  getSlots(@Query() query: GetSlotsDto) {
    return this.appointmentsService.getAvailableSlots(
      query.doctorId,
      query.date,
    );
  }

  /** Rendez-vous du patient connecté. */
  @Get('me')
  findMine(@CurrentUser() user: AuthUser) {
    return this.appointmentsService.findMine(user.id);
  }

  /** Tous les rendez-vous (administration). */
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Post()
  book(@CurrentUser() user: AuthUser, @Body() dto: BookAppointmentDto) {
    return this.appointmentsService.book(user.id, dto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.appointmentsService.cancel(id, {
      id: user.id,
      role: user.role,
    });
  }
}
