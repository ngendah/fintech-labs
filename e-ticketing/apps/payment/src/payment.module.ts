import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {
  BookingRepository,
  BookingSchemaModule,
  HealthCheckModule,
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
import { TicketingService } from './ticketing.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    HealthCheckModule,
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
    TicketingService,
  ],
})
export class PaymentModule {}
