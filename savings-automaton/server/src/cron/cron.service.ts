import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JengaService } from 'src/partners/jenga/jenga.service';
import { Frequency, SavingSchedule, Telco } from '@prisma/client';
import { DepositDto } from 'src/partners/jenga/dto/jenga.dto';
import crypto from 'node:crypto';
import { endOfDay, nextRunDate, startOfDay } from 'src/utils/dateUtils';

@Injectable()
export class CronService {
  constructor(
    private prisma: PrismaService,
    private jengaService: JengaService,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  monthlyDeposit() {
    this.deposit(Frequency.Monthly);
  }

  @Cron(CronExpression.EVERY_WEEK)
  weeklyDeposit() {
    this.deposit(Frequency.Weekly);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  dailyDeposit() {
    this.deposit(Frequency.Daily);
  }

  async deposit(frequency: Frequency) {
    const schedules = await this.prisma.savingSchedule.findMany({
      where: {
        startDate: {
          gte: startOfDay(),
          lt: endOfDay(),
        },
        isActive: true,
        frequency,
      },
    });
    await Promise.all(schedules.map((s) => this.requestDeposit(s)));
  }

  private async requestDeposit(schedule: SavingSchedule) {
    const reference = crypto.randomUUID();
    const request = await this.jengaService.requestDeposit({
      ref: reference,
      amount: schedule.amount.toNumber(),
      currency: 'KES',
      telco: Telco.Safaricom,
      mobileNumber: schedule.mobileNumber,
      date: schedule.startDate.toISOString(),
    } as DepositDto);
    const data = {
      reference,
      executedAt: new Date(),
      status: request.status,
      message: request.message,
    };
    await this.prisma.savingLog.create({ data });
    // TODO introduce retries
    const nextRunAt = nextRunDate(schedule.nextRunAt, schedule.frequency);
    await this.prisma.savingSchedule.update({
      where: { id: schedule.id },
      data: { startDate: schedule.nextRunAt, nextRunAt },
    });
  }
}
