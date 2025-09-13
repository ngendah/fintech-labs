import { NestFactory } from '@nestjs/core';
import { KycServiceModule } from './kyc.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    KycServiceModule,
    {
      useFactory: (configService: ConfigService) => {
        let tlsOptions: Record<string, any> | undefined;
        const useTLS = configService.get('USE_TLS', false);
        if (useTLS) {
          const tlsCAFile = configService.get('TLS_CA_FILE');
          const tlsKeyFile = configService.get('TLS_KEY_FILE');
          tlsOptions = {
            key: readFileSync(tlsKeyFile, 'utf-8').toString(),
            cert: readFileSync(tlsCAFile, 'utf-8').toString(),
          };
        }
        const host = configService.get('HOST', '0.0.0.0')
        const port = configService.get('PORT', 3002)
        return {
          transport: Transport.TCP,
          options: {
            host,
            port,
            tlsOptions,
          },
        };
      },
      inject: [ConfigService],
    },
  );
  await app.listen();
}
bootstrap();
