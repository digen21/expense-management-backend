import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exception-filter/global-exception-filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes extra fields not defined in DTO.
      transform: true, // converts request data to DTO types
      forbidNonWhitelisted: true, // it throws error
    }),
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Server is running on : http://localhost:${port}/${globalPrefix}`);
}

bootstrap().catch((err) => {
  Logger.error('Application failed to start', err);
  process.exit(1);
});
