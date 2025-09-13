import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FRAUD_DETECTION_SERVICE } from 'lib/common';
import { FraudService } from './fraud.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: FRAUD_DETECTION_SERVICE,
        useFactory: async (configService: ConfigService) => {
          let tlsOptions: Record<string, any> | undefined;
          const useTLS = configService.get('USE_TLS', false);
          if (useTLS) {
            const tlsCAFile = configService.get('TLS_CA_FILE');
            tlsOptions = {
              ca: [readFileSync(tlsCAFile, 'utf-8').toString()],
            };
          }
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get('FRAUD_DETECTION_SERVICE_HOST'),
              port: configService.get('FRAUD_DETECTION_SERVICE_PORT', 3001),
              tlsOptions,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [FraudService],
  exports: [FraudService],
})
export class FraudModule {}
