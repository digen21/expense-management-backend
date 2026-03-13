import { Body, Controller, Headers, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ServerError from 'src/utils/ServerError';
import { ExpenseStatusWebhookDto } from './dto/expense-status-webhook.dto';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly configService: ConfigService,
  ) {}

  @Post('expense-status')
  async updateExpenseStatus(
    @Headers('x-webhook-secret') secret: string | undefined,
    @Body() body: ExpenseStatusWebhookDto,
  ) {
    if (
      !secret ||
      secret !== this.configService.getOrThrow<string>('WEBHOOK_SECRET')
    ) {
      throw new ServerError({
        message: 'Invalid webhook secret',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return this.webhooksService.updateExpenseStatus({
      expenseId: body.expense_id,
      newStatus: body.new_status,
      rejectionReason: body.rejection_reason,
    });
  }
}
