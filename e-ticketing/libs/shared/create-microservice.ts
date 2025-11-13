import { NestFactory } from '@nestjs/core';
import {
  AsyncMicroserviceOptions,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { DynamicModule, ForwardReference, Logger, Type } from '@nestjs/common';
import {
  NATS_DEFAULT_HOST,
  NATS_DEFAULT_PORT,
  NATS_HOST,
  NATS_PORT,
} from './constants';

type IEntryNestModule =
  | Type<any>
  | DynamicModule
  | ForwardReference
  | Promise<IEntryNestModule>;

export const createMicroServiceApp = async (
  module: IEntryNestModule,
  name: string,
) => {
  const app = await NestFactory.create(module);
  const logger = new Logger(`createMicroServiceApp(${name})`);
  app.connectMicroservice<AsyncMicroserviceOptions>({
    useFactory: (config: ConfigService) => {
      const host = config.get(NATS_HOST, NATS_DEFAULT_HOST);
      const port = config.get<number>(NATS_PORT, NATS_DEFAULT_PORT);
      const server = `nats://${host}:${port}`;
      logger.debug(`nats-server-url=${server}`);
      return {
        transport: Transport.NATS,
        options: {
          queue: name,
          servers: [server],
        },
      };
    },
    inject: [ConfigService],
  });
  const healthCheckPort = process.env['HEALTH_PORT'] ?? 3000;
  return {
    listen: async () => {
      const [service, server] = await Promise.all([
        app.startAllMicroservices(),
        app.listen(healthCheckPort),
      ]);
      logger.log(`Health checks available on port ${server.address().port}`);
      return { service, server };
    },
  };
};

export const createMicroserviceClientModule = (name: string) => {
  return ClientsModule.registerAsync([
    {
      name,
      useFactory: async (config: ConfigService) => {
        const host = config.get(NATS_HOST, NATS_DEFAULT_HOST);
        const port = config.get<number>(NATS_PORT, NATS_DEFAULT_PORT);
        const logger = new Logger(`createMicroserviceClientModule($name)`);
        const server = `nats://${host}:${port}`;
        logger.debug(`nats-server-url=${server}`);
        return {
          transport: Transport.NATS,
          options: {
            queue: name,
            servers: [server],
          },
        };
      },
      inject: [ConfigService],
    },
  ]);
};
