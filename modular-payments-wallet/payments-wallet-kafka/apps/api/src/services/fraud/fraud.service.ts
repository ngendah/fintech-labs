import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FRAUD_DETECTION_SERVICE, fraudReviewEndpoint } from 'lib/common';

@Injectable()
export class FraudService {
  private readonly logger = new Logger(FraudService.name);
  constructor(
    @Inject(FRAUD_DETECTION_SERVICE)
    private readonly client: ClientKafka,
  ) {}

  async review(documents: Record<string, any>[]) {
    this.client.send(fraudReviewEndpoint, documents).subscribe((results) => {
      this.logger.debug(results);
    });
  }
}
