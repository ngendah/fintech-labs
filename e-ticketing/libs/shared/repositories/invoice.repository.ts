import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { invoiceNoGenerator } from '../sequence-generator';
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema';

@Injectable()
export class InvoiceRepository {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async new({
    bookingNo,
    amount,
    paymentPhoneNo,
    emailTo,
  }: {
    bookingNo: string;
    amount: number;
    paymentPhoneNo: string;
    emailTo: string;
  }): Promise<InvoiceDocument | null> {
    const invoice = new this.invoiceModel({
      bookingNo,
      amount,
      paymentPhoneNo,
      emailTo,
      invoiceNo: invoiceNoGenerator(),
    });
    return invoice.save();
  }

  async get(invoiceNo: string): Promise<InvoiceDocument> {
    const invoice = await this.invoiceModel.findOne({ invoiceNo }).exec();
    if (!invoice) {
      throw new Error(`Invoice no ${invoiceNo} not found`);
    }
    return invoice;
  }
}
