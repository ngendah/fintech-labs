import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthnzModule } from './authnz/authnz.module';
import { RegisterModule } from './register/register.module';
import { PaymentModule } from './payment/payment.module';
import { BookingModule } from './booking/booking.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthnzModule,
    RegisterModule,
    PaymentModule,
    BookingModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
