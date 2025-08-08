import { Frequency } from '@prisma/client';

// TODO Add field validation
export class CreateScheduleDto {
  amount: number;
  frequency: Frequency;
  startDate: Date;
}
