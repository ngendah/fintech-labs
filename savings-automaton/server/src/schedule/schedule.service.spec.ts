import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { ScheduleModule } from './schedule.module';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<ScheduleService>(ScheduleService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new schedule', async () => {
    const now = new Date();
    const next = new Date(now.setMonth(now.getMonth() + 1));
    prisma.savingSchedule.create.mockResolvedValue({
      userId: 1,
      amount: 100.0,
      frequency: 'Monthly',
      startDate: now,
      nextRunAt: next,
    });
    const result = await service.create({
      user: { connect: { id: 1 } },
      amount: 100.0,
      frequency: 'Daily',
      startDate: now,
      nextRunAt: next,
    });
    expect(result).toBeDefined();
  });

  // TODO implement tests
  it('should update an existing schedule', async () => {});
  it('should delete an existing schedule', async () => {});
});
