import { HttpException, HttpStatus } from '@nestjs/common';

export class ServerError extends HttpException {
  constructor({
    message,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  }: {
    message: string;
    statusCode?: HttpStatus | number;
  }) {
    super(message, statusCode);
  }
}

export default ServerError;
