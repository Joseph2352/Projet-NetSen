import { IsString, MinLength } from 'class-validator';

export class CreateCenterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  address!: string;

  @IsString()
  @MinLength(2)
  contact!: string;
}

export class UpdateCenterDto extends CreateCenterDto {}
