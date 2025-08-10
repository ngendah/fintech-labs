import { Test, TestingModule } from '@nestjs/testing';
import { JengaModule } from 'src/partners/jenga/jenga.module';
import { JengaService } from 'src/partners/jenga/jenga.service';

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
