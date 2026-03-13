import { ExpenseStatus } from '@prisma/expense-tracker-client';
import { IsEnum, IsString, IsUUID, ValidateIf } from 'class-validator';

export class ExpenseStatusWebhookDto {
  @IsUUID()
  expense_id: string;

  @IsEnum(ExpenseStatus)
  new_status: ExpenseStatus;

  @ValidateIf(
    (o: ExpenseStatusWebhookDto) => o.new_status === ExpenseStatus.REJECTED,
  )
  @IsString()
  rejection_reason?: string;
}
