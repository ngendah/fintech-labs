import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from 'lib/common';
import { NotificationService } from './notification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: NOTIFICATION_SERVICE,
        useFactory: async (configService: ConfigService) => {
          const uri = configService.get('KAFKA_URI', 'localhost:9092');
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: [uri],
              },
              consumer: {
                groupId: NOTIFICATION_SERVICE.toString(),
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
