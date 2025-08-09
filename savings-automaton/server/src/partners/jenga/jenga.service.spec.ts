import { Test, TestingModule } from '@nestjs/testing';
import { JengaService } from 'src/partners/jenga/jenga.service';
import { JengaModule } from 'src/partners/jenga/jenga.module';

describe('JengaService', () => {
  let service: JengaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JengaModule],
    }).compile();

    service = module.get<JengaService>(JengaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
