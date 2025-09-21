import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATION_SERVICE } from 'lib/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    NotificationServiceModule,
    {
      useFactory: (configService: ConfigService) => {
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
  );
  await app.listen();
}
bootstrap();
