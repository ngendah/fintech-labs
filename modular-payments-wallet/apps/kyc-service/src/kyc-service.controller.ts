import { Controller, Get } from '@nestjs/common';
import { KycServiceService } from './kyc-service.service';

@Controller()
export class KycServiceController {
  constructor(private readonly kycServiceService: KycServiceService) {}

  @Get()
  getHello(): string {
    return this.kycServiceService.getHello();
  }
}
