import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern } from '@nestjs/microservices';
import { EndPoint } from 'libs/shared';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(EndPoint.PAY)
  pay(payment: {
    invoiceNo: string;
    paymentPhoneNo: string;
    emailTo: string;
  }): Promise<string> {
    return this.paymentService.payBooking(payment);
  }

  @MessagePattern(EndPoint.PAYMENT_RESULTS)
  payResults(results: {
    id: string;
    amount: number;
    thirdPartyId: string;
  }): Promise<void> {
    return this.paymentService.payConfirmation(results);
  }
}
