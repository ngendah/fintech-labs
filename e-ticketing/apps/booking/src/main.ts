import { BookingModule } from './booking.module';
import { BOOKING_SERVICE, createMicroServiceApp } from 'libs/shared';

async function bootstrap() {
  const app = await createMicroServiceApp(BookingModule, BOOKING_SERVICE);
  await app.listen();
}
bootstrap();
