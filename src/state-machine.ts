import { ExpenseStatus, Role } from '@prisma/expense-tracker-client';
import ServerError from './utils/ServerError';
import { HttpStatus } from '@nestjs/common';

const TRANSITION_RULES = [
  { from: ExpenseStatus.DRAFT, to: ExpenseStatus.SUBMITTED },
  { from: ExpenseStatus.SUBMITTED, to: ExpenseStatus.APPROVED },
  { from: ExpenseStatus.SUBMITTED, to: ExpenseStatus.REJECTED },
  { from: ExpenseStatus.REJECTED, to: ExpenseStatus.SUBMITTED },
];

export function isValidExpenseTransition(
  current: ExpenseStatus,
  next: ExpenseStatus,
  role?: Role,
) {
  if (role === Role.USER) {
    if (next === ExpenseStatus.APPROVED || next === ExpenseStatus.REJECTED) {
      return false;
    }
  }

  return TRANSITION_RULES.some((r) => r.from === current && r.to === next);
}

function transitionExpense(
  current: ExpenseStatus,
  next: ExpenseStatus,
  rejectionReason?: string,
  role?: Role,
) {
  const valid = isValidExpenseTransition(current, next, role);

  if (!valid)
    throw new ServerError({
      message: `Invalid transition ${current} -> ${next}`,
      statusCode: HttpStatus.FORBIDDEN,
    });

  if (next === ExpenseStatus.REJECTED && !rejectionReason) {
    throw new ServerError({
      message: 'Rejection reason required',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  return { status: next, rejectionReason };
}

export default transitionExpense;
