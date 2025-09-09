import { Controller, Get } from '@nestjs/common';
import { TransactionServiceService } from './transaction-service.service';

@Controller()
export class TransactionServiceController {
  constructor(private readonly transactionServiceService: TransactionServiceService) {}

  @Get()
  getHello(): string {
    return this.transactionServiceService.getHello();
  }
}
