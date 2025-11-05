import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Payment {
  @Prop({ required: true, unique: true, index: true })
  paymentId: string;

  @Prop({ reqired: true })
  amount: number;

  @Prop({ required: true, unique: true, index: true })
  bookingId: string;

  @Prop({ index: true })
  receiptId: string;

  @Prop()
  paidAt: Date;
}

export type PaymentDocument = HydratedDocument<Payment>;

export const PaymentSchema = SchemaFactory.createForClass(Payment);
