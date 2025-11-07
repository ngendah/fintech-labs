import { PaymentModule } from './payment.module';
import { createMicroServiceApp, PAYMENT_SERVICE } from 'libs/shared';

async function bootstrap() {
  const app = await createMicroServiceApp(PaymentModule, PAYMENT_SERVICE);
  await app.listen();
}
bootstrap();
