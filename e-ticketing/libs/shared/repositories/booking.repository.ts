import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { bookingNoGenerator } from '../sequence-generator';

@Injectable()
export default class BookingRepository {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async new(
    userId: string,
    eventId: string,
    seats: string[],
  ): Promise<BookingDocument | null> {
    const booking = new this.bookingModel({
      userId,
      eventId,
      seats,
      bookingNo: bookingNoGenerator(),
    });
    return booking.save();
  }

  async get(ticketNo: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findOne({ ticketNo }).exec();
    if (!booking) {
      throw new Error(`Ticket no ${ticketNo} not found`);
    }
    return booking;
  }
}
