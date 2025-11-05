import { NestFactory } from '@nestjs/core';
import { BookingModule } from './booking.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
