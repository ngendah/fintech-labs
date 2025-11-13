import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import {
  BOOKING_SERVICE,
  BookingId,
  EndPoint,
  UserBookingDto,
} from 'libs/shared';
import { Observable } from 'rxjs';
import { rpcErrorInterceptor } from '../exception-filter';

@Injectable()
export class BookingService {
  constructor(@Inject(BOOKING_SERVICE) private readonly client: ClientNats) {}

  book(booking: UserBookingDto): Observable<BookingId> {
    return this.client
      .send<BookingId>(EndPoint.BOOKING, booking)
      .pipe(rpcErrorInterceptor());
  }
}
