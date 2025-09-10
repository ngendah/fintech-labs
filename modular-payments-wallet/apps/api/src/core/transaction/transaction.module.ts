import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { FraudModule } from '../../services/fraud/fraud.module';

@Module({
  imports: [FraudModule],
  controllers: [TransactionController],
})
export class TransactionModule {}
