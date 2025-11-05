import { NestFactory } from '@nestjs/core';
import { AuthnzModule } from './authnz.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthnzModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
