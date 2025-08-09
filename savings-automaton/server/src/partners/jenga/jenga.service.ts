import { Injectable, Logger } from '@nestjs/common';
import { SavingSchedule } from '@prisma/client';
import { JengaApi } from 'src/partners/jenga/jenga.api';
import {
  DepositConfirmationDto,
  DepositDto,
} from 'src/partners/jenga/dto/jenga.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JengaService {
  private readonly logger = new Logger(JengaService.name, { timestamp: true });

  constructor(
    private prisma: PrismaService,
    private jengaApi: JengaApi,
  ) {}

  async requestDeposit(
    deposit: DepositDto,
  ): Promise<{ transactionId: string } | undefined> {
    try {
      // TODO refactor bearerToken call to instead get it from cache
      const bearer = await this.jengaApi.bearerToken();
      const result = await this.jengaApi.pushDepositRequest(
        bearer.token,
        deposit,
      );
      return { transactionId: result.transactionId };
    } catch (err) {
      this.logger.error(err);
    }
  }

  async confirmDeposit(deposit: DepositConfirmationDto) {
    const schedule = await this.prisma.savingSchedule.findFirst({
      where: {
        reference: deposit.transactionReference,
      },
    });
    if (!schedule) {
      return this.logger.error(`Unable to confirm deposit: ${deposit}`);
    }
    const userId = (schedule as SavingSchedule).userId;
    {
      const data = {
        userId: userId,
        amount: deposit.debitedAmount,
        reference: deposit.transactionReference,
      };
      await this.prisma.saving.create({ data });
    }
    {
      const data = {
        reference: deposit.transactionReference,
        amount: deposit.charge,
      };
      await this.prisma.serviceCharge.create({ data });
    }
    // TODO notify user that the deposit is successful
  }
}
