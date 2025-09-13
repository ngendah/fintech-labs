import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KYC_SERVICE } from 'lib/common';
import { KycService } from './kyc.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: KYC_SERVICE,
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get('KYC_SERVICE_HOST'),
              port: configService.get('KYC_SERVICE_PORT', 3002),
            },
          }
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule { }
