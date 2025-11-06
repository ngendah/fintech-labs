import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Receipt {
  @Prop({ required: true, unique: true, index: true })
  receiptNo: string;

  @Prop({ reqired: true })
  amount: number;

  @Prop({ required: true, index: true })
  invoiceNo: string;
}

export type ReceiptDocument = HydratedDocument<Receipt>;
export const ReceiptSchema = SchemaFactory.createForClass(Receipt);
export const ReceiptSchemaModule = MongooseModule.forFeature([
  { name: Receipt.name, schema: ReceiptSchema },
]);
