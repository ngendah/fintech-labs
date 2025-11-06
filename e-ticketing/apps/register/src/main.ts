import { RegisterModule } from './register.module';
import { createMicroServiceApp } from 'libs/shared';

async function bootstrap() {
  const app = await createMicroServiceApp(RegisterModule);
  await app.listen();
}
bootstrap();
