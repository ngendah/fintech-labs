import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';

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
      createdAt: Date.now(),
    });
    const user = await service.create({
      name: 'test',
      email: 'test@email.com',
    });
    expect(user).toBeDefined();
    expect(user?.id).toBeDefined();
    expect(user?.name).toBe('test');
    expect(user?.email).toBe('test@email.com');
  });
});
