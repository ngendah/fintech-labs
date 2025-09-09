import { Module } from '@nestjs/common';
import { KycServiceController } from './kyc-service.controller';
import { KycServiceService } from './kyc-service.service';

@Module({
  imports: [],
  controllers: [KycServiceController],
  providers: [KycServiceService],
})
export class KycServiceModule {}
