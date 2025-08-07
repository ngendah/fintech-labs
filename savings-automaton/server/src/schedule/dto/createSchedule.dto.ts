import { Frequency } from '@prisma/client';

export class CreateScheduleDto {
  userId: string;
  amount: number;
  frequency: Frequency;
  startAt: Date;
}
