import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsUUID,
} from 'class-validator';
import { Role } from '@prisma/expense-tracker-client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsUUID()
  @IsOptional()
  organizationId?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}
