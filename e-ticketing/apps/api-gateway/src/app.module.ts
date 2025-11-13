import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthnzModule } from './authnz/authnz.module';
import { RegisterModule } from './register/register.module';
import { PaymentsModule } from './payments/payments.module';
import { BookingModule } from './booking/booking.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { HealthCheckModule } from 'libs/shared';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthnzModule,
    BookingModule,
    EventsModule,
    HealthCheckModule,
    PaymentsModule,
    RegisterModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
