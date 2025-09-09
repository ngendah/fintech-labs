import { NestFactory } from '@nestjs/core';
import { KycServiceModule } from './kyc-service.module';

async function bootstrap() {
  const app = await NestFactory.create(KycServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
