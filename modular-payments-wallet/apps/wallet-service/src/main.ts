import { NestFactory } from '@nestjs/core';
import { WalletServiceModule } from './wallet-service.module';

async function bootstrap() {
  const app = await NestFactory.create(WalletServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
