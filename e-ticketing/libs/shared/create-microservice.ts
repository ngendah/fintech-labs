import { NestFactory } from '@nestjs/core';
import {
  AsyncMicroserviceOptions,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  DynamicModule,
  ForwardReference,
  Logger,
  LogLevel,
  Type,
} from '@nestjs/common';
import { NATS_DEFAULT_URI, NATS_URI } from './constants';

type IEntryNestModule =
  | Type<any>
  | DynamicModule
  | ForwardReference
  | Promise<IEntryNestModule>;

export function loggingLevel(): LogLevel[] {
  const allowed: LogLevel[] = [
    'verbose',
    'debug',
    'log',
    'warn',
    'error',
    'fatal',
  ];
  const level = process.env.LOG_LEVEL;
  return allowed.includes((level as LogLevel) ?? undefined)
    ? ([level!] as LogLevel[])
    : (['verbose'] as LogLevel[]);
}

export const createMicroServiceApp = async (
  module: IEntryNestModule,
  name: string,
) => {
  const logLevel = loggingLevel();
  const app = await NestFactory.create(module, {
    logger: logLevel,
  });
  const logger = new Logger(`createMicroServiceApp(${name})`);
  app.connectMicroservice<AsyncMicroserviceOptions>({
    useFactory: (config: ConfigService) => {
      const natsUri = config.get<string>(NATS_URI, NATS_DEFAULT_URI);
      const servers = natsUri.split(',');
      logger.debug(`nats-servers: ${servers}`);
      return {
        transport: Transport.NATS,
        options: {
          queue: name,
          servers,
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
        const logLevel = loggingLevel();
        const logger = new Logger(`createMicroserviceClientModule(${name})`);
        const natsUri = config.get<string>(NATS_URI, NATS_DEFAULT_URI);
        const servers = natsUri.split(',');
        logger.debug(`nats-servers: ${servers}`);
        return {
          logger: logLevel,
          transport: Transport.NATS,
          options: {
            queue: name,
            servers,
          },
        };
      },
      inject: [ConfigService],
    },
  ]);
};
