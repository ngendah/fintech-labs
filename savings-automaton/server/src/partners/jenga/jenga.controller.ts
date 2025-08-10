import { Body, Controller, Logger, Post } from '@nestjs/common';
import { DepositConfirmationDto } from './dto/jenga.dto';
import { JengaService } from './jenga.service';

@Controller({ path: 'daraja', host: '*.finserve.africa' })
export class JengaController {
  private readonly logger = new Logger(JengaService.name, { timestamp: true });

  constructor(private jengaService: JengaService) {}

  @Post()
  callback(@Body() deposit: DepositConfirmationDto) {
    if (!deposit.status || deposit.code != 3) {
      return this.logger.error(
        `Saving Deposit failure ${deposit.transactionReference}`,
      );
    }
    this.jengaService.confirmDeposit(deposit);
  }
}
