import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { CoreModule } from './core/core.module';
import { FraudModule } from './fraud/fraud.module';
import { KycModule } from './kyc/kyc.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [CoreModule, FraudModule, KycModule, NotificationModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
