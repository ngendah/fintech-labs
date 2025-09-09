import { NestFactory } from '@nestjs/core';
import { TransactionServiceModule } from './transaction-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
