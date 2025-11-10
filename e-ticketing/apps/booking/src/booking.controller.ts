import { Controller } from '@nestjs/common';
import { BookingService } from './booking.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  EndPoint,
  BookingId,
  type UserBookingDto,
} from 'libs/shared';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @MessagePattern(EndPoint.BOOKING)
  book(booking: UserBookingDto): Promise<BookingId> {
    return this.bookingService.book(booking);
  }

  @MessagePattern(EndPoint.BOOKING_LIST)
  bookList(booking: Omit<UserBookingDto, 'seats'>): Promise<BookingId[]> {
    return this.bookingService.get(booking.userId, booking.eventId);
  }
}
