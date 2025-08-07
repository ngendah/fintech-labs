import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
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

  it('/POST sign-in', async () => {
    const passwd = await bcrypt.hash('testpass', 10);
    prisma.user.findFirst.mockResolvedValue({
      id: 1,
      name: 'test',
      email: 'test@email.com',
      password: passwd,
      createdAt: Date.now(),
    });

    request
      .agent(app.getHttpServer())
      .post('/user/sign-in')
      .send({ email: 'test@email.com', password: 'testpass' })
      .expect(200);
  });
});
