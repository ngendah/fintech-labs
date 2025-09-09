import { Module } from '@nestjs/common';
import { AuthModule } from './src/auth/auth.module';
import { TransactionModule } from './src/transaction/transaction.module';
import { WalletModule } from './src/wallet/wallet.module';

@Module({
  imports: [AuthModule, TransactionModule, WalletModule]
})
export class CoreModule {}
