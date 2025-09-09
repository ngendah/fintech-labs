import { Controller, Get } from '@nestjs/common';
import { FraudDetectionServiceService } from './fraud-detection-service.service';

@Controller()
export class FraudDetectionServiceController {
  constructor(private readonly fraudDetectionServiceService: FraudDetectionServiceService) {}

  @Get()
  getHello(): string {
    return this.fraudDetectionServiceService.getHello();
  }
}
