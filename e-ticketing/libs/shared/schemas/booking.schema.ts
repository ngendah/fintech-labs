import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Booking {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ required: true, unique: true, index: true })
  eventId: string;

  @Prop({ required: true })
  seats: string[];

  @Prop({ required: true, unique: true, index: true })
  bookingNo: string;
}

export type BookingDocument = HydratedDocument<Booking>;

export const BookingSchema = SchemaFactory.createForClass(Booking);
