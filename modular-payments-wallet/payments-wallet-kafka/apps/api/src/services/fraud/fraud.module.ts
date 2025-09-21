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
          const uri = configService.get('KAFKA_URI', 'localhost:9092');
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: `${FRAUD_DETECTION_SERVICE.toString()}-client`,
                brokers: [uri],
              },
              consumer: {
                groupId: FRAUD_DETECTION_SERVICE.toString(),
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
  providers: [FraudService],
  exports: [FraudService],
})
export class FraudModule { }
