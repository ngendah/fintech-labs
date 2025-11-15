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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    HealthCheckModule,
    BookingSchemaModule,
    InvoiceSchemaModule,
  ],
  controllers: [BookingController],
  providers: [BookingRepository, InvoiceRepository, BookingService],
})
export class BookingModule {}
