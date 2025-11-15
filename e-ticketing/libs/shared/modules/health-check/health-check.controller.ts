import { Controller, Get, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
} from '@nestjs/terminus';
import {
  NATS_DEFAULT_HOST,
  NATS_DEFAULT_PORT,
  NATS_HOST,
  NATS_PORT,
} from 'libs/shared/constants';

const HEALTH_KEY = 'nats';

@Controller('health')
export class HealthCheckController {
  private logger = new Logger(HealthCheckController.name);
  constructor(
    private readonly config: ConfigService,
    private health: HealthCheckService,
    private readonly healthIndicator: HealthIndicatorService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([() => this.isHealthy(HEALTH_KEY)]);
  }

  async isHealthy(key: string) {
    const indicator = this.healthIndicator.check(key);
    let client: ClientProxy | null | undefined;
    try {
      const host = this.config.get(NATS_HOST, NATS_DEFAULT_HOST);
      const port = this.config.get(NATS_PORT, NATS_DEFAULT_PORT);
      client = ClientProxyFactory.create({
        transport: Transport.NATS,
        options: {
          servers: [`nats://${host}:${port}`],
        },
      });
      await client?.connect();
      client?.close();
      return indicator.up();
    } catch (error) {
      this.logger.error(error);
      return indicator.down();
    }
  }
}
