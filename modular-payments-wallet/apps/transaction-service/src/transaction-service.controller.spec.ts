import { Test, TestingModule } from '@nestjs/testing';
import { TransactionServiceController } from './transaction-service.controller';
import { TransactionServiceService } from './transaction-service.service';

describe('TransactionServiceController', () => {
  let transactionServiceController: TransactionServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionServiceController],
      providers: [TransactionServiceService],
    }).compile();

    transactionServiceController = app.get<TransactionServiceController>(TransactionServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(transactionServiceController.getHello()).toBe('Hello World!');
    });
  });
});
