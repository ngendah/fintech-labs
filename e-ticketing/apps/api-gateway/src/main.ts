import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggingLevel } from 'libs/shared';

async function bootstrap() {
  const logLevel = loggingLevel();
  const app = await NestFactory.create(AppModule, { logger: logLevel });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
