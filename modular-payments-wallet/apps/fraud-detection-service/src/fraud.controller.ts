import { Controller } from '@nestjs/common';
import { FraudDetectionServiceService } from './fraud.service';
import { MessagePattern } from '@nestjs/microservices';
import { fraudReviewEndpoint } from 'lib/common';

@Controller()
export class FraudDetectionServiceController {
  constructor(
    private readonly fraudDetectionServiceService: FraudDetectionServiceService,
  ) { }

  @MessagePattern(fraudReviewEndpoint)
  async detect(documents: Record<string, any>[]) {
    const review = await this.fraudDetectionServiceService.review(documents);
    return {
      reviewId: 'doc-123',
      review,
    };
  }
}
