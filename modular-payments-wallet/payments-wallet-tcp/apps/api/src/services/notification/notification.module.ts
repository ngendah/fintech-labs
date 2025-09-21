import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from 'lib/common';
import { NotificationService } from './notification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: NOTIFICATION_SERVICE,
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
              host: configService.get('NOTIFICATION_SERVICE_HOST'),
              port: configService.get('NOTIFICATION_SERVICE_PORT', 3003),
              tlsOptions,
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
