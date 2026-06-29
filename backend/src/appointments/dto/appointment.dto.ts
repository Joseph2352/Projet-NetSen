import { IsDateString, IsString } from 'class-validator';

export class GetSlotsDto {
  @IsString()
  doctorId!: string;

  @IsDateString()
  date!: string; // "YYYY-MM-DD"
}

export class BookAppointmentDto {
  @IsString()
  doctorId!: string;

  /** Début du créneau au format ISO renvoyé par l'endpoint des créneaux. */
  @IsDateString()
  startTime!: string;
}
