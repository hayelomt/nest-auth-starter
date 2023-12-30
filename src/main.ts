import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppConfig } from './config/app.config';
import { customValidationFactory } from './core/resources/error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port } = app.get(ConfigService).get<AppConfig>('app');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: customValidationFactory,
    }),
  );

  await app.listen(port);
}
bootstrap();
