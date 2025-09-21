import { Controller, Get } from '@nestjs/common';
import { KycServiceService } from './kyc.service';
import { kycReviewEndpoint } from 'lib/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class KycServiceController {
  constructor(private readonly kycServiceService: KycServiceService) {}

  @MessagePattern(kycReviewEndpoint)
  kyc(documents: Record<string, any>): Promise<Record<string, any>> {
    return this.kycServiceService.reviewDocuments(documents);
  }
}
