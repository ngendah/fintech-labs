import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { receiptNoGenerator } from '../sequence-generator';
import { Receipt, ReceiptDocument } from '../schemas/receipt.schema';

@Injectable()
export default class ReceiptRepository {
  constructor(
    @InjectModel(Receipt.name) private receiptModel: Model<Receipt>,
  ) {}

  async new({
    invoiceNo,
    amount,
  }: {
    invoiceNo: string;
    amount: number;
  }): Promise<ReceiptDocument | null> {
    const receipt = new this.receiptModel({
      invoiceNo,
      amount,
      receiptNo: receiptNoGenerator(),
    });
    return receipt.save();
  }

  async get(receiptNo: string): Promise<ReceiptDocument> {
    const receipt = await this.receiptModel.findOne({ receiptNo }).exec();
    if (!receipt) {
      throw new Error(`Invoice no ${receiptNo} not found`);
    }
    return receipt;
  }
}
