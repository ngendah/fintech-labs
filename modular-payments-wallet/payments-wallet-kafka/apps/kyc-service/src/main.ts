import { NestFactory } from '@nestjs/core';
import { KycServiceModule } from './kyc.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KYC_SERVICE } from 'lib/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    KycServiceModule,
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
              allowAutoTopicCreation: true,
              groupId: KYC_SERVICE.toString(),
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
