import {
  Body,
  Controller,
  createParamDecorator,
  ExecutionContext,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../authnz/authnz.guard';
import {
  BookingId,
  type UserBookingDto,
  type UserDocument,
  type BookingDto,
} from 'libs/shared';
import { BookingService } from './booking.service';
import { Observable } from 'rxjs';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@UseGuards(AuthGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  book(
    @Body() booking: BookingDto,
    @User() user: UserDocument,
  ): Observable<BookingId> {
    return this.bookingService.book({
      ...booking,
      userId: user._id.toString(),
    } as UserBookingDto);
  }
}
