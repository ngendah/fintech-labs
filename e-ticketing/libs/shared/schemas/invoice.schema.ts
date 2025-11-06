import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Invoice {
  @Prop({ required: true, unique: true, index: true })
  invoiceNo: string;

  @Prop({ reqired: true })
  amount: number;

  @Prop({ required: true, unique: true, index: true })
  bookingNo: string;

  @Prop({ required: true })
  paymentPhoneNo: string;

  @Prop({ required: true })
  emailTo: string;
}

export type InvoiceDocument = HydratedDocument<Invoice>;

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
