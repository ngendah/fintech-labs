import { Controller, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { MessagePattern } from '@nestjs/microservices';
import { EndPoint } from 'libs/shared';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern(EndPoint.BOOKING)
  book(booking: {
    userId: string;
    eventId: string;
    seats: string[];
    paymentPhoneNo: string;
    emailTo: string;
  }): Promise<string> {
    return this.bookingService.book(booking);
  }
}
