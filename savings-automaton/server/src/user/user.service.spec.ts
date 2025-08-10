import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<UserService>(UserService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    prisma.user.create.mockResolvedValue({
      id: 1,
      name: 'test',
      email: 'test@email.com',
      password: 'testpass',
      createdAt: Date.now(),
    });
    const user = await service.create({
      name: 'test',
      email: 'test@email.com',
      password: 'testpass',
    });
    expect(user).toBeDefined();
    expect(user?.id).toBeDefined();
    expect(user?.name).toBe('test');
    expect(user?.email).toBe('test@email.com');
  });

  it('should signin user', async () => {
    const passwd = await bcrypt.hash('testpass', 10);
    prisma.user.findFirst.mockResolvedValue({
      id: 1,
      name: 'test',
      email: 'test@email.com',
      password: passwd,
      createdAt: Date.now(),
    });
    const user = await service.signIn({
      email: 'test@email.com',
      password: 'testpass',
    });
    expect(user).toBeDefined();
  });
});
