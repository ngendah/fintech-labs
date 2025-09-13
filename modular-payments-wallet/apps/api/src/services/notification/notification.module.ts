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
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get('NOTIFICATION_SERVICE_HOST'),
              port: configService.get('NOTIFICATION_SERVICE_PORT', 3003),
            },
          }
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule { }
