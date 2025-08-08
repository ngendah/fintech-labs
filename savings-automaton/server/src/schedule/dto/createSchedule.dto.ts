import { Frequency, Telco } from '@prisma/client';

// TODO Add field validation
export class CreateScheduleDto {
  amount: number;
  frequency: Frequency;
  startDate: Date;
  mobileNumber: String;
  telco: Telco;
}
