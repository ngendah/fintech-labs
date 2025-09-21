import { Module } from '@nestjs/common';
import { FraudDetectionServiceController } from './fraud.controller';
import { FraudDetectionServiceService } from './fraud.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [FraudDetectionServiceController],
  providers: [FraudDetectionServiceService],
})
export class FraudDetectionServiceModule {}
