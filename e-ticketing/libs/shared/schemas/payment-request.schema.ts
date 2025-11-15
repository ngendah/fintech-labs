import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum PaymentStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  INPROGRESS = 'in-progress',
}

@Schema()
export class PaymentRequest {
  @Prop({ required: true, unique: true, index: true })
  invoiceNo: string;

  @Prop({ required: true, unique: true, index: true })
  paymentPhoneNo: string;

  @Prop({ required: true })
  emailTo: string;

  @Prop({ required: true, default: PaymentStatus.INPROGRESS })
  status: PaymentStatus;

  @Prop({ index: true })
  thirdPartyId: string;

  @Prop({ default: 0 })
  amount: number;
}

export type PaymentRequestDocument = HydratedDocument<PaymentRequest>;
export const PaymentRequestSchema =
  SchemaFactory.createForClass(PaymentRequest);
export const PaymentRequestSchemaModule = MongooseModule.forFeature([
  { name: PaymentRequest.name, schema: PaymentRequestSchema },
]);
