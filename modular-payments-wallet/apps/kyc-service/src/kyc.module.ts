import { Module } from '@nestjs/common';
import { KycServiceController } from './kyc.controller';
import { KycServiceService } from './kyc.service';

@Module({
  imports: [],
  controllers: [KycServiceController],
  providers: [KycServiceService],
})
export class KycServiceModule {}
