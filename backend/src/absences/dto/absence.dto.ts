import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AbsenceReason } from '@prisma/client';

export class CreateAbsenceDto {
  @IsString()
  doctorId!: string;

  @IsDateString()
  startDate!: string; // ISO, ex "2026-07-01"

  @IsDateString()
  endDate!: string; // ISO, inclus

  @IsEnum(AbsenceReason)
  reason!: AbsenceReason;

  @IsOptional()
  @IsString()
  note?: string;
}
