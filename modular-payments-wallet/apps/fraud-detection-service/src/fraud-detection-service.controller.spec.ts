import { Test, TestingModule } from '@nestjs/testing';
import { FraudDetectionServiceController } from './fraud-detection-service.controller';
import { FraudDetectionServiceService } from './fraud-detection-service.service';

describe('FraudDetectionServiceController', () => {
  let fraudDetectionServiceController: FraudDetectionServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FraudDetectionServiceController],
      providers: [FraudDetectionServiceService],
    }).compile();

    fraudDetectionServiceController = app.get<FraudDetectionServiceController>(FraudDetectionServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fraudDetectionServiceController.getHello()).toBe('Hello World!');
    });
  });
});
