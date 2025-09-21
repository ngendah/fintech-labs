import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KYC_SERVICE } from 'lib/common';
import { KycService } from './kyc.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: KYC_SERVICE,
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
              host: configService.get('KYC_SERVICE_HOST'),
              port: configService.get('KYC_SERVICE_PORT', 3002),
              tlsOptions,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
