import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Ticket {
  @Prop({ required: true, unique: true, index: true })
  ticketNo: string;

  @Prop({ reqired: true })
  seatNo: string;

  @Prop({ required: true, index: true })
  receiptNo: string;
}

export type TicketDocument = HydratedDocument<Ticket>;
export const TicketSchema = SchemaFactory.createForClass(Ticket);
export const TicketSchemaModule = MongooseModule.forFeature([
  { name: Ticket.name, schema: TicketSchema },
]);
