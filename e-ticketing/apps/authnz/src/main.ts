import { AuthnzModule } from './authnz.module';
import { createMicroServiceApp } from 'libs/shared';

async function bootstrap() {
  const app = await createMicroServiceApp(AuthnzModule);
  await app.listen();
}
bootstrap();
