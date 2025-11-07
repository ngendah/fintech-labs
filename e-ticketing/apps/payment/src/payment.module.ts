import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {
  BookingRepository,
  BookingSchemaModule,
  InvoiceRepository,
  InvoiceSchemaModule,
  MongoModule,
  PaymentRequestRepository,
  PaymentRequestSchemaModule,
  ReceiptRepository,
  ReceiptSchemaModule,
  TicketRepository,
  TicketSchemaModule,
} from 'libs/shared';

@Module({
  imports: [
    MongoModule,
    BookingSchemaModule,
    InvoiceSchemaModule,
    ReceiptSchemaModule,
    PaymentRequestSchemaModule,
    TicketSchemaModule,
  ],
  controllers: [PaymentController],
  providers: [
    BookingRepository,
    InvoiceRepository,
    PaymentRequestRepository,
    ReceiptRepository,
    TicketRepository,
    PaymentService,
  ],
})
export class PaymentModule {}
