import { NestFactory } from '@nestjs/core';
import { FraudDetectionServiceModule } from './fraud.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { FRAUD_DETECTION_SERVICE } from 'lib/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    FraudDetectionServiceModule,
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
              groupId: FRAUD_DETECTION_SERVICE.toString(),
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
