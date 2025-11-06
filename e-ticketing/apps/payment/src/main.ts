import { PaymentModule } from './payment.module';
import { createMicroServiceApp } from 'libs/shared';

async function bootstrap() {
  const app = await createMicroServiceApp(PaymentModule);
  await app.listen();
}
bootstrap();
