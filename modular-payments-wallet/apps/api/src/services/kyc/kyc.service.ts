import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, TcpEvents } from '@nestjs/microservices';
import { KYC_SERVICE, kycReviewEndpoint } from 'lib/common';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);
  constructor(
    @Inject(KYC_SERVICE)
    private readonly client: ClientProxy<TcpEvents>,
  ) {
    this.client.on('error', (error) => this.logger.error(error));
  }

  async review(documents: Record<string, any>) {
    this.client.send(kycReviewEndpoint, documents).subscribe((results) => {
      this.logger.debug(results);
    });
  }
}
