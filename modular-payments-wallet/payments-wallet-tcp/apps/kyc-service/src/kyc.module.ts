import { Module } from '@nestjs/common';
import { KycServiceController } from './kyc.controller';
import { KycServiceService } from './kyc.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [KycServiceController],
  providers: [KycServiceService],
})
export class KycServiceModule {}
