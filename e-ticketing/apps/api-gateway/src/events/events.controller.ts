import {
  Controller,
  createParamDecorator,
  ExecutionContext,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../authnz/authnz.guard';
import {
  BookingId,
  HttpPerformanceInterceptor,
  type UserDocument,
} from 'libs/shared';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get(':eventId/bookings')
  @UseInterceptors(HttpPerformanceInterceptor)
  list(
    @Param('eventId') eventId: string,
    @User() user: UserDocument,
  ): Observable<BookingId[]> {
    return this.eventsService.list({ userId: user._id.toString(), eventId });
  }
}
