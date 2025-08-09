import { Frequency } from '@prisma/client';

export function startOfDay(): Date {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export function endOfDay(): Date {
  const endOfDay = new Date();
  endOfDay.setDate(endOfDay.getDate() + 1);
  endOfDay.setHours(0, 0, 0, 0);
  return endOfDay;
}

export function nextRunDate(date: Date, frequency: Frequency): Date {
  const at = date;
  let nextRunAt: Date;
  switch (frequency) {
    case 'Daily':
      nextRunAt = new Date(new Date(at).setDate(at.getDate() + 1));
      break;
    case 'Weekly':
      nextRunAt = new Date(new Date(at).setDate(at.getDate() + 7));
      break;
    case 'Monthly':
      nextRunAt = new Date(new Date(at).setMonth(at.getMonth() + 1));
      break;
    default:
      nextRunAt = new Date(new Date(at).setMonth(at.getMonth() + 1));
      break;
  }
  return nextRunAt;
}
