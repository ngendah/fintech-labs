import { Module } from '@nestjs/common';
import { createMicroserviceClientModule, PAYMENT_SERVICE } from 'libs/shared';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AuthnzModule } from '../authnz/authnz.module';

@Module({
  imports: [AuthnzModule, createMicroserviceClientModule(PAYMENT_SERVICE)],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
