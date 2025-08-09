import { Test, TestingModule } from '@nestjs/testing';
import { CronModule } from 'src/cron/cron.module';
import { CronService } from 'src/cron/cron.service';

describe('CronService', () => {
  let service: CronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CronModule],
    }).compile();

    service = module.get<CronService>(CronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
