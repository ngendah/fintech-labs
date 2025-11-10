import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern } from '@nestjs/microservices';
import { EndPoint, type PayResultDto, type UserPayDto } from 'libs/shared';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(EndPoint.PAY)
  pay(payment: UserPayDto): Promise<string> {
    return this.paymentService.payBooking(payment);
  }

  @MessagePattern(EndPoint.PAYMENT_RESULTS)
  payResults(results: PayResultDto): Promise<void> {
    return this.paymentService.payConfirmation(results);
  }
}
