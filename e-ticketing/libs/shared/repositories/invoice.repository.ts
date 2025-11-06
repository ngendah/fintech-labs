import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { invoiceNoGenerator } from '../sequence-generator';
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema';
import mongoose from 'mongoose';

@Injectable()
export class InvoiceRepository {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async new(
    invoice: {
      bookingNo: string;
      amount: number;
      paymentPhoneNo: string;
      emailTo: string;
    },
    session?: mongoose.ClientSession,
  ): Promise<InvoiceDocument | null> {
    const newInvoice = new this.invoiceModel({
      ...invoice,
      invoiceNo: invoiceNoGenerator(),
    });
    return newInvoice.save({ session });
  }

  async get(invoiceNo: string): Promise<InvoiceDocument> {
    const invoice = await this.invoiceModel.findOne({ invoiceNo }).exec();
    if (!invoice) {
      throw new Error(`Invoice no ${invoiceNo} not found`);
    }
    return invoice;
  }
}
