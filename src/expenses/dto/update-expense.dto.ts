import { PartialType } from '@nestjs/mapped-types';
import { ExpenseStatus } from '@prisma/expense-tracker-client';
import { IsEnum, IsString, IsUUID, ValidateIf } from 'class-validator';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

export class UpdateExpenseStatusDto {
  @IsEnum(ExpenseStatus)
  status: ExpenseStatus;

  @ValidateIf(
    (o: UpdateExpenseStatusDto) => o.status === ExpenseStatus.REJECTED,
  )
  @IsString()
  rejectionReason?: string;
}

export class IdParamsDto {
  @IsUUID()
  id: string;
}
