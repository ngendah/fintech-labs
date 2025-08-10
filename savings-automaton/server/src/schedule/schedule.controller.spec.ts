import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Frequency, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/dto/user.dto';
import * as request from 'supertest';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { ScheduleController } from './schedule.controller';
import { ScheduleModule } from './schedule.module';

class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    let req = context.switchToHttp().getRequest(); // eslint-disable-line
    // eslint-disable-next-line
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
    const mobileNumber = '+254008900700';
    const telco = 'Equitel';
    prisma.savingSchedule.create.mockResolvedValue({
      id: 1,
      userId: 1,
      reference: 'e8bf27bb-da02-4165-8f6f-d8801494a7df',
      amount: 100,
      frequency: Frequency.Daily,
      startDate: new Date(),
      nextRunAt,
      mobileNumber,
      telco,
    });
    return request
      .agent(app.getHttpServer())
      .post('/schedule')
      .send({
        amount: 100,
        frequency: Frequency.Daily,
        startDate: new Date(),
        mobileNumber,
        telco,
      } as CreateScheduleDto)
      .expect(201);
  });
});
