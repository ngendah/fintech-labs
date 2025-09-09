import { Module } from '@nestjs/common';
import { FraudDetectionServiceController } from './fraud-detection-service.controller';
import { FraudDetectionServiceService } from './fraud-detection-service.service';

@Module({
  imports: [],
  controllers: [FraudDetectionServiceController],
  providers: [FraudDetectionServiceService],
})
export class FraudDetectionServiceModule {}
