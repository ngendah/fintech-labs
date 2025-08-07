import { Frequency } from '@prisma/client';

// TODO Add validation
export class UpdateScheduleDto {
  id: number;
  amount?: number;
  frequency?: Frequency;
  startAt?: Date;
}
