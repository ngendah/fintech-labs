import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { KycServiceModule } from '../src/kyc.module';

describe('KycServiceController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [KycServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
