import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { receiptNoGenerator } from '../sequence-generator';
import { Receipt, ReceiptDocument } from '../schemas/receipt.schema';
import mongoose from 'mongoose';

@Injectable()
export class ReceiptRepository {
  constructor(
    @InjectModel(Receipt.name) private receiptModel: Model<Receipt>,
  ) {}

  async new(
    payment: {
      invoiceNo: string;
      amount: number;
      paymentPhoneNo: string;
      emailTo: string;
    },
    session?: mongoose.ClientSession,
  ): Promise<ReceiptDocument | null> {
    const receipt = new this.receiptModel({
      ...payment,
      receiptNo: receiptNoGenerator(),
    });
    return receipt.save({ session });
  }

  async get(receiptNo: string): Promise<ReceiptDocument[]> {
    const receipts = await this.receiptModel.find({ receiptNo }).exec();
    if (!receipts.length) {
      throw new Error(`Invoice no ${receiptNo} not found`);
    }
    return receipts;
  }

  async total(invoiceNo: string): Promise<number> {
    const result = await this.receiptModel
      .aggregate([
        {
          $match: {
            invoiceNo,
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
          },
        },
      ])
      .exec();
    return result.length > 0 ? result[0].totalAmount : 0;
  }
}
