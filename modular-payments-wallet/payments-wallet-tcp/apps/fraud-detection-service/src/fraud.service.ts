import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FraudDetectionServiceService {
  private readonly logger = new Logger(FraudDetectionServiceService.name);

  async review(documents: Record<string, any>[]): Promise<Record<string, any>> {
    this.logger.debug(
      `reviewing documents for fraud: ${JSON.stringify(documents)}`,
    );
    return {
      fraudDetected: true,
      documents,
    };
  }
}
