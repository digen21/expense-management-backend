import { IsNumber, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class EnvConfig {
  @Type(() => Number)
  @IsNumber()
  PORT!: number;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  @MinLength(32)
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @MinLength(32)
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @MinLength(32)
  WEBHOOK_SECRET!: string;
}
