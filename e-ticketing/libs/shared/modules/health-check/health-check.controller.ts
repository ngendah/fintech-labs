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
import { NATS_DEFAULT_URI, NATS_URI } from 'libs/shared/constants';

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
      const natsUri = this.config.get<string>(NATS_URI, NATS_DEFAULT_URI);
      const servers = natsUri.split(',');
      client = ClientProxyFactory.create({
        transport: Transport.NATS,
        options: {
          servers,
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
