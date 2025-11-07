import { NestFactory } from '@nestjs/core';
import {
  AsyncMicroserviceOptions,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

type IEntryNestModule =
  | Type<any>
  | DynamicModule
  | ForwardReference
  | Promise<IEntryNestModule>;

export const createMicroServiceApp = async (
  module: IEntryNestModule,
  name: string,
) =>
  NestFactory.createMicroservice<AsyncMicroserviceOptions>(module, {
    useFactory: (config: ConfigService) => {
      const host = config.get('NATS_HOST', 'localhost');
      const port = config.get<number>('NATS_PORT', 4222);
      return {
        transport: Transport.NATS,
        options: {
          queue: name,
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
            queue: name,
            servers: [`nats://${host}:${port}`],
          },
        };
      },
      inject: [ConfigService],
    },
  ]);
};
