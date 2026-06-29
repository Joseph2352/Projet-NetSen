import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // "HH:mm"

export class AvailabilityDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number; // 0 = dimanche ... 6 = samedi

  @Matches(TIME_REGEX, { message: 'startTime doit être au format HH:mm.' })
  startTime!: string;

  @Matches(TIME_REGEX, { message: 'endTime doit être au format HH:mm.' })
  endTime!: string;
}

export class CreateDoctorDto {
  @IsString()
  @MinLength(2)
  firstName!: string;

  @IsString()
  @MinLength(2)
  lastName!: string;

  @IsString()
  specialtyId!: string;

  @IsString()
  centerId!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  availabilities?: AvailabilityDto[];
}

export class UpdateDoctorDto extends CreateDoctorDto {}

export class SetAvailabilitiesDto {
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  availabilities!: AvailabilityDto[];
}
