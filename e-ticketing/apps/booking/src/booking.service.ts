import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { BookingRepository, InvoiceRepository } from 'libs/shared';
import {
  MicroServiceException,
  RpcExceptionCode,
} from 'libs/shared/rpc-exception';
import mongoose from 'mongoose';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly invoiceRepository: InvoiceRepository,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async book(booking: {
    userId: string;
    eventId: string;
    seats: string[];
    paymentPhoneNo: string;
    emailTo: string;
  }): Promise<string> {
    const session = await this.connection.startSession();
    return session.withTransaction(async () => {
      const book = await this.bookingRepository.new(
        booking.userId,
        booking.eventId,
        booking.seats,
      );
      if (!book) {
        throw new MicroServiceException(
          `Unable to create booking for event ${booking.eventId}`,
          RpcExceptionCode.BOOKING_EXCEPTION,
        );
      }
      const amount = this.calculateBookingCost(booking.seats);
      const invoice = this.invoiceRepository.new(
        {
          bookingNo: book.bookingNo,
          amount,
          paymentPhoneNo: booking.paymentPhoneNo,
          emailTo: booking.emailTo,
        },
        session,
      );
      if (!invoice) {
        throw new MicroServiceException(
          `Unable to create booking for event ${booking.eventId}`,
          RpcExceptionCode.BOOKING_EXCEPTION,
        );
      }
      return book.bookingNo;
    });
  }

  calculateBookingCost(seats: string[]) {
    const ticketPrice = 100;
    return seats.length * ticketPrice;
  }
}
