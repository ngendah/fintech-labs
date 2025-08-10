import { Injectable } from '@nestjs/common';
import { Prisma, SavingSchedule } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.SavingScheduleCreateInput,
  ): Promise<SavingSchedule> {
    const schedule = await this.prisma.savingSchedule.create({ data });
    return schedule;
  }

  async update(params: {
    where: Prisma.SavingScheduleWhereUniqueInput;
    data: Prisma.SavingScheduleUpdateInput;
  }): Promise<SavingSchedule | undefined> {
    return this.prisma.savingSchedule.update(params);
  }

  async delete(
    where: Prisma.SavingScheduleWhereUniqueInput,
  ): Promise<SavingSchedule | undefined> {
    return this.prisma.savingSchedule.delete({ where });
  }
}
