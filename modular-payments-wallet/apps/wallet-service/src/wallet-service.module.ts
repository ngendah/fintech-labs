import { Module } from '@nestjs/common';
import { WalletServiceController } from './wallet-service.controller';
import { WalletServiceService } from './wallet-service.service';

@Module({
  imports: [],
  controllers: [WalletServiceController],
  providers: [WalletServiceService],
})
export class WalletServiceModule {}
