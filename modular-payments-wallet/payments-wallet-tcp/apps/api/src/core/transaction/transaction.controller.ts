import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FraudService } from 'apps/api/src/services/fraud/fraud.service';

interface TransferRequestDto {
  amount: number;
  mobileNumber: string;
}

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(private readonly fraudService: FraudService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  transferMoney(@Body() transferRequest: TransferRequestDto) {
    this.logger.debug(`money transfer: ${JSON.stringify(transferRequest)}`);
    this.fraudService.review([transferRequest] as Record<string, any>[]);
    return {
      id: '123',
    };
  }
}
