import { RegisterModule } from './register.module';
import { createMicroServiceApp, REGISTER_SERVICE } from 'libs/shared';

async function bootstrap() {
  const app = await createMicroServiceApp(RegisterModule, REGISTER_SERVICE);
  await app.listen();
}
bootstrap();
