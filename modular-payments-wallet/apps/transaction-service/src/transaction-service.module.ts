import { Module } from '@nestjs/common';
import { TransactionServiceController } from './transaction-service.controller';
import { TransactionServiceService } from './transaction-service.service';

@Module({
  imports: [],
  controllers: [TransactionServiceController],
  providers: [TransactionServiceService],
})
export class TransactionServiceModule {}
