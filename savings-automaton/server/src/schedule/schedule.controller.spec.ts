import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleModule } from './schedule.module';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { User } from 'src/user/dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaClient, Frequency } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/createSchedule.dto';

class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = {
      id: 1,
      name: 'test',
    } as User;
    return true;
  }
}

describe('ScheduleController', () => {
  let app: INestApplication;
  let controller: ScheduleController;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideGuard(AuthGuard)
      .useValue(new MockAuthGuard())
      .compile();

    prisma = module.get(PrismaService);
    controller = module.get<ScheduleController>(ScheduleController);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/POST schedule', async () => {
    const now = new Date();
    const nextRunAt = new Date(now.setMonth(now.getMonth() + 1));
    prisma.savingSchedule.create.mockResolvedValue({
      id: 1,
      userId: 1,
      amount: 100,
      frequency: Frequency.Daily,
      startDate: new Date(),
      nextRunAt,
    });
    return request
      .agent(app.getHttpServer())
      .post('/schedule')
      .send({
        amount: 100,
        frequency: Frequency.Daily,
        startDate: new Date(),
      } as CreateScheduleDto)
      .expect(201);
  });
});
