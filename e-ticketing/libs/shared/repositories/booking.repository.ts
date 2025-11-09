import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { bookingNoGenerator } from '../sequence-generator';
import mongoose from 'mongoose';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async new(
    userId: string,
    eventId: string,
    seats: string[],
    session?: mongoose.ClientSession,
  ): Promise<BookingDocument | null> {
    const booking = new this.bookingModel({
      userId,
      eventId,
      seats,
      bookingNo: bookingNoGenerator(),
    });
    return booking.save({ session });
  }

  async find(userId: string, eventId: string): Promise<BookingDocument[]> {
    return this.bookingModel
      .find({
        userId,
        eventId,
      })
      .exec();
  }

  async get(bookingNo: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findOne({ bookingNo }).exec();
    if (!booking) {
      throw new Error(`Booking no ${bookingNo} not found`);
    }
    return booking;
  }
}
