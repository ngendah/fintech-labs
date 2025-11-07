import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaymentRequest,
  PaymentRequestDocument,
} from '../schemas/payment-request.schema';
import mongoose from 'mongoose';

@Injectable()
export class PaymentRequestRepository {
  constructor(
    @InjectModel(PaymentRequest.name)
    private paymentRequestModel: Model<PaymentRequest>,
  ) {}

  async new(
    request: Partial<PaymentRequest>,
    session?: mongoose.ClientSession,
  ): Promise<PaymentRequestDocument | null> {
    const payment = new this.paymentRequestModel(request);
    return payment.save({ session });
  }

  async get(id: string): Promise<PaymentRequestDocument> {
    const request = await this.paymentRequestModel.findOne({ _id: id }).exec();
    if (!request) {
      throw new Error(`Payment request id ${id} not found`);
    }
    return request;
  }
}
