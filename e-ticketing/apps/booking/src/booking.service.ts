import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  UserBookingDto,
  BookingId,
  BookingRepository,
  InvoiceRepository,
  BookingDocument,
} from 'libs/shared';
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
  ) { }

  async book(booking: UserBookingDto): Promise<BookingId> {
    const session = await this.connection.startSession();
    return session.withTransaction(async (session) => {
      var book: BookingDocument[] | BookingDocument | null =
        await this.bookingRepository.find(booking.userId, booking.eventId);
      if (!book) {
        book = await this.bookingRepository.new(
          booking.userId,
          booking.eventId,
          booking.seats,
        );
      } else {
        const bookedSeats = new Set(book.flatMap((b) => b.seats));
        const requestedSeats = new Set(booking.seats);
        const newSeats = [...requestedSeats].filter(
          (seat) => !bookedSeats.has(seat),
        );
        if (newSeats.length == 0) {
          throw new MicroServiceException(
            `Unable to create booking for event ${booking.eventId}, already exists`,
            RpcExceptionCode.BOOKING_EXCEPTION,
          );
        }
        book = await this.bookingRepository.new(
          booking.userId,
          booking.eventId,
          newSeats,
        );
      }
      if (!book) {
        throw new MicroServiceException(
          `Unable to create booking for event ${booking.eventId}`,
          RpcExceptionCode.BOOKING_EXCEPTION,
        );
      }
      const amount = this.calculateBookingCost(booking.seats);
      const invoice = await this.invoiceRepository.new(
        {
          bookingNo: book.bookingNo,
          amount,
        },
        session,
      );
      if (!invoice) {
        throw new MicroServiceException(
          `Unable to create booking for event ${booking.eventId}`,
          RpcExceptionCode.BOOKING_EXCEPTION,
        );
      }
      return { bookingNo: book.bookingNo, invoiceNo: invoice.invoiceNo };
    });
  }

  calculateBookingCost(seats: string[]) {
    const ticketPrice = 100;
    return seats.length * ticketPrice;
  }

  async get(userId: string, eventId: string): Promise<BookingId[]> {
    const bookings = await this.bookingRepository.find(userId, eventId);
    if (bookings.length == 0) {
      return [];
    }
    const invoices = await this.invoiceRepository.findByBookings(
      bookings.map((book) => book.bookingNo),
    );
    if (invoices.length == 0) {
      return [];
    }
    const bookingMap = new Map(bookings.map(({ bookingNo, seats }) => [bookingNo, seats]))
    return invoices.map((invoice) => ({
      bookingNo: invoice.bookingNo,
      invoiceNo: invoice.invoiceNo,
      amount: invoice.amount,
      seats: bookingMap.get(invoice.bookingNo) ?? [],
    }));
  }
}
