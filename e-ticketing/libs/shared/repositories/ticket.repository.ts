import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';

@Injectable()
export class TicketRepository {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}

  async new(ticket: Ticket): Promise<TicketDocument | null> {
    const tick = new this.ticketModel(ticket);
    return tick.save();
  }

  async get(ticketNo: string): Promise<TicketDocument> {
    const ticket = await this.ticketModel.findOne({ ticketNo }).exec();
    if (!ticket) {
      throw new Error(`Ticket no ${ticketNo} not found`);
    }
    return ticket;
  }
}
