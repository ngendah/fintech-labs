import { Test, TestingModule } from '@nestjs/testing';
import { KycServiceController } from './kyc-service.controller';
import { KycServiceService } from './kyc-service.service';

describe('KycServiceController', () => {
  let kycServiceController: KycServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KycServiceController],
      providers: [KycServiceService],
    }).compile();

    kycServiceController = app.get<KycServiceController>(KycServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(kycServiceController.getHello()).toBe('Hello World!');
    });
  });
});
