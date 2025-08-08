import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SavingSchedule, Prisma } from '@prisma/client';

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
