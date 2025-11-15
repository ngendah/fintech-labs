import { Injectable } from '@nestjs/common';
import {
  BookingRepository,
  Invoice,
  Ticket,
  TicketRepository,
} from 'libs/shared';
import {
  MicroServiceException,
  RpcExceptionCode,
} from 'libs/shared/rpc-exception';
import { ticketNoGenerator } from 'libs/shared/sequence-generator';

@Injectable()
export class TicketingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly ticketRepository: TicketRepository,
  ) {}

  async createAndSendTickets(emailTo: string, invoice: Invoice) {
    const booking = await this.bookingRepository.get(invoice.bookingNo);
    if (!booking) {
      throw new MicroServiceException(
        `Booking no ${invoice.bookingNo} not found`,
        RpcExceptionCode.PAYMENT_COLLECTION_EXCEPTION,
      );
    }
    const tickets = await Promise.all(
      booking.seats.map((seat) =>
        this.ticketRepository.new({
          ticketNo: ticketNoGenerator(seat),
          invoiceNo: invoice.invoiceNo,
          seatNo: seat,
        }),
      ),
    );
    this.sendTickets(emailTo, tickets);
  }

  sendTickets(emailTo: string, ticket: (Ticket | null)[]) {
    // TODO: send tickets, IO-bound
  }
}
