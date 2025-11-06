import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import {
  BookingRepository,
  BookingSchemaModule,
  InvoiceRepository,
  InvoiceSchemaModule,
  MongoModule,
} from 'libs/shared';

@Module({
  imports: [MongoModule, BookingSchemaModule, InvoiceSchemaModule],
  controllers: [BookingController],
  providers: [BookingRepository, InvoiceRepository, BookingService],
})
export class BookingModule {}
