import { Injectable, Logger } from '@nestjs/common';
import { Status } from '@prisma/client';
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
  ): Promise<{ status: Status; message?: string }> {
    try {
      // TODO refactor bearerToken call to instead get it from cache
      const bearer = await this.jengaApi.bearerToken();
      const result = await this.jengaApi.pushDepositRequest(
        bearer.token,
        deposit,
      );
      return { status: Status.INITIATED };
    } catch (err) {
      this.logger.error(err);
      return { status: Status.FAILED, message: err };
    }
  }

  async confirmDeposit(deposit: DepositConfirmationDto) {
    const log = await this.prisma.savingLog.findFirst({
      where: {
        reference: deposit.transactionReference,
      },
    });
    if (!log) {
      return this.logger.error(
        `Unable to confirm deposit: ${deposit}, missing saving-log`,
      );
    }
    const schedule = await this.prisma.savingSchedule.findUnique({
      where: { id: log.scheduleId },
    });
    if (!schedule) {
      return this.logger.error(
        `Unable to confirm deposit: ${deposit}, missing saving-schedule ${log.scheduleId}`,
      );
    }
    const userId = schedule.userId;
    {
      const data = {
        userId,
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
    await this.prisma.savingLog.update({
      where: { id: log.id },
      data: { status: Status.SUCCESS },
    });
    // TODO notify user that the deposit is successful
  }
}
