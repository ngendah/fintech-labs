import { Test, TestingModule } from '@nestjs/testing';
import { JengaController } from 'src/partners/jenga/jenga.controller';
import { JengaModule } from 'src/partners/jenga/jenga.module';

describe('JengaController', () => {
  let controller: JengaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JengaModule],
    }).compile();

    controller = module.get<JengaController>(JengaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
