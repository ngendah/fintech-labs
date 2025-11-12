import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import {
  HealthCheckModule,
  BookingRepository,
  BookingSchemaModule,
  InvoiceRepository,
  InvoiceSchemaModule,
  MongoModule,
} from 'libs/shared';

@Module({
  imports: [
    MongoModule,
    HealthCheckModule,
    BookingSchemaModule,
    InvoiceSchemaModule,
  ],
  controllers: [BookingController],
  providers: [BookingRepository, InvoiceRepository, BookingService],
})
export class BookingModule {}
