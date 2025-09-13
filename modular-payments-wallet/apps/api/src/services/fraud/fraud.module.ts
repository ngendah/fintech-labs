import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FRAUD_DETECTION_SERVICE } from 'lib/common';
import { FraudService } from './fraud.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: FRAUD_DETECTION_SERVICE,
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get('FRAUD_DETECTION_SERVICE_HOST'),
              port: configService.get('FRAUD_DETECTION_SERVICE_PORT', 3001),
            },
          }
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [FraudService],
  exports: [FraudService],
})
export class FraudModule { }
