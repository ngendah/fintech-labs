import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import {
  BOOKING_SERVICE,
  BookingId,
  EndPoint,
  UserBookingDto,
} from 'libs/shared';
import { Observable } from 'rxjs';

@Injectable()
export class EventsService {
  constructor(@Inject(BOOKING_SERVICE) private readonly client: ClientNats) {}

  list(booking: Omit<UserBookingDto, 'seats'>): Observable<BookingId[]> {
    return this.client.send<BookingId[]>(EndPoint.BOOKING_LIST, booking);
  }
}
