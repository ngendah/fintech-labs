import { AuthnzModule } from './authnz.module';
import { AUTHNZ_SERVICE, createMicroServiceApp } from 'libs/shared';

async function bootstrap() {
  const app = await createMicroServiceApp(AuthnzModule, AUTHNZ_SERVICE);
  await app.listen();
}
bootstrap();
