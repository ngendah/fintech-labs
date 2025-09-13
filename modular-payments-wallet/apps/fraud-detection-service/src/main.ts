import { NestFactory } from '@nestjs/core';
import { FraudDetectionServiceModule } from './fraud.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    FraudDetectionServiceModule,
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
        return {
          transport: Transport.TCP,
          options: {
            port: configService.get('PORT', 3001),
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
