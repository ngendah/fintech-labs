import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AuthnzModule } from '../authnz/authnz.module';
import { BOOKING_SERVICE, createMicroserviceClientModule } from 'libs/shared';

@Module({
  imports: [AuthnzModule, createMicroserviceClientModule(BOOKING_SERVICE)],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule { }
