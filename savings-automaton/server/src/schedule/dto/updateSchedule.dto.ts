import { Frequency } from '@prisma/client';

// TODO Add validation
export class UpdateScheduleDto {
  amount?: number;
  frequency?: Frequency;
  startDate?: Date;
}
