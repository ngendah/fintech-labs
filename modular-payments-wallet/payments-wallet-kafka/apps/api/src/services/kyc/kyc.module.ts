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
          const uri = configService.get('KAFKA_URI', 'localhost:9092');
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: `${KYC_SERVICE.toString()}-client`,
                brokers: [uri],
              },
              consumer: {
                groupId: KYC_SERVICE.toString(),
              },
              producer: {
                allowAutoTopicCreation: true,
              },
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
export class KycModule { }
