import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/expense-tracker-client';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
