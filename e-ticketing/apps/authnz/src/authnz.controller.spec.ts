import { Test, TestingModule } from '@nestjs/testing';
import { AuthnzController } from './authnz.controller';
import { AuthnzService } from './authnz.service';

describe('AuthnzController', () => {
  let authnzController: AuthnzController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthnzController],
      providers: [AuthnzService],
    }).compile();

    authnzController = app.get<AuthnzController>(AuthnzController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authnzController.getHello()).toBe('Hello World!');
    });
  });
});
