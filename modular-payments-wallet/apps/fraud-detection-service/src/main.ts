import { NestFactory } from '@nestjs/core';
import { FraudDetectionServiceModule } from './fraud-detection-service.module';

async function bootstrap() {
  const app = await NestFactory.create(FraudDetectionServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
