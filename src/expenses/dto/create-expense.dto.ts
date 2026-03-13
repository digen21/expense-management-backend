import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsDecimal,
} from 'class-validator';
import { ExpenseCategory } from '@prisma/expense-tracker-client';

export class CreateExpenseDto {
  @IsDecimal()
  amount: string;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}
