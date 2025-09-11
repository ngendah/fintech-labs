import { Inject, Logger } from '@nestjs/common';
import { ClientProxy, TcpEvents } from '@nestjs/microservices';
import { FRAUD_DETECTION_SERVICE, fraudReviewEndpoint } from 'lib/common';

export class FraudService {
  private readonly logger = new Logger(FraudService.name);
  constructor(
    @Inject(FRAUD_DETECTION_SERVICE)
    private readonly client: ClientProxy<TcpEvents>,
  ) {
    this.client.on('error', (error) => this.logger.error(error));
  }

  async review(documents: Record<string, any>[]) {
    this.client.send(fraudReviewEndpoint, documents).subscribe((results) => {
      this.logger.debug(results);
    });
  }
}
