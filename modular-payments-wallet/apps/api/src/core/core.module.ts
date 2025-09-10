import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [AuthModule, TransactionModule, WalletModule],
})
export class CoreModule {}
