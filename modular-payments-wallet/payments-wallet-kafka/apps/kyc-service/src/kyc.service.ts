import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KycServiceService {
  private readonly logger = new Logger(KycServiceService.name);

  async reviewDocuments(
    documents: Record<string, any>,
  ): Promise<Record<string, any>> {
    this.logger.debug(
      `Reviewing user kyc documents: ${JSON.stringify(documents)}`,
    );
    return {
      kycId: 345,
      status: 'success',
      documents,
    };
  }
}
