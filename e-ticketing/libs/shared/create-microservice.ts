import { NestFactory } from '@nestjs/core';
import {
  AsyncMicroserviceOptions,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';

export const createMicroServiceApp = async (module) =>
  NestFactory.createMicroservice<AsyncMicroserviceOptions>(module, {
    useFactory: (config: ConfigService) => {
      const host = config.get('NATS_HOST', 'localhost');
      const port = config.get<number>('NATS_PORT', 4222);
      return {
        transport: Transport.NATS,
        options: {
          servers: [`nats://${host}:${port}`],
        },
      };
    },
    inject: [ConfigService],
  });

export const createMicroserviceClientModule = (name: string) => {
  return ClientsModule.registerAsync([
    {
      imports: [ConfigModule],
      name,
      useFactory: async (config: ConfigService) => {
        const host = config.get('NATS_HOST', 'localhost');
        const port = config.get<number>('NATS_PORT', 4222);
        return {
          transport: Transport.NATS,
          options: {
            servers: [`nats://${host}:${port}`],
          },
        };
      },
      inject: [ConfigService],
    },
  ]);
};
