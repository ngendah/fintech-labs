import { Module } from '@nestjs/common';
import { NotificationModule } from '../../services/notification/notification.module';
import { WalletController } from './wallet.controller';

@Module({
  imports: [NotificationModule],
  controllers: [WalletController],
})
export class WalletModule {}
