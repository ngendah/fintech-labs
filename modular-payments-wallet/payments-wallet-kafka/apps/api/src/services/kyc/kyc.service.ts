import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KYC_SERVICE, kycReviewEndpoint } from 'lib/common';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);
  constructor(
    @Inject(KYC_SERVICE)
    private readonly client: ClientKafka,
  ) {}

  async review(documents: Record<string, any>) {
    this.client.send(kycReviewEndpoint, documents).subscribe((results) => {
      this.logger.debug(results);
    });
  }
}
