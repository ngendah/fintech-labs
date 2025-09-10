import { Module } from '@nestjs/common';
import { FraudDetectionServiceController } from './fraud.controller';
import { FraudDetectionServiceService } from './fraud.service';

@Module({
  imports: [],
  controllers: [FraudDetectionServiceController],
  providers: [FraudDetectionServiceService],
})
export class FraudDetectionServiceModule {}
