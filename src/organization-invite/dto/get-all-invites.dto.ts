import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class GetAllInvites {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number = 10;

  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    return value === 'true';
  })
  @IsBoolean()
  accepted?: boolean;
}
