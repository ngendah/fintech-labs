import { NestFactory } from '@nestjs/core';
import { RegisterModule } from './register.module';

async function bootstrap() {
  const app = await NestFactory.create(RegisterModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
