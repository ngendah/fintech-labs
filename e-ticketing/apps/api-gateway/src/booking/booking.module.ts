import { Module } from '@nestjs/common';
import {
  createMicroserviceClientModule,
  APP_NAME,
  BOOKING_SERVICE,
} from 'libs/shared';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { AuthnzModule } from '../authnz/authnz.module';

@Module({
  imports: [AuthnzModule, createMicroserviceClientModule(BOOKING_SERVICE)],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
