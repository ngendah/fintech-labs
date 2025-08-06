import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserModule } from './user.module';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserController', () => {
  let app: INestApplication;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    prisma = module.get(PrismaService);
    app = module.createNestApplication();
    await app.init();
  });

  it('/POST user', () => {
    prisma.user.create.mockResolvedValue({
      id: 1,
      name: 'test',
      email: 'test@email.com',
      createdAt: Date.now(),
    });

    request
      .agent(app.getHttpServer())
      .post('/user')
      .send({ name: 'test', email: 'test@email.com' })
      .expect(201);
  });
});
