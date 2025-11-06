import { BookingModule } from './booking.module';
import { createMicroServiceApp } from 'libs/shared';

async function bootstrap() {
  const app = await createMicroServiceApp(BookingModule);
  await app.listen();
}
bootstrap();
