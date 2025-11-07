import { Injectable } from '@nestjs/common';
import {
  Invoice,
  InvoiceRepository,
  PaymentRequestRepository,
  PaymentStatus,
  Receipt,
  ReceiptRepository,
} from 'libs/shared';
import {
  MicroServiceException,
  RpcExceptionCode,
} from 'libs/shared/rpc-exception';
import { TicketingService } from './ticketing.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly paymentRequestRepository: PaymentRequestRepository,
    private readonly receiptRepository: ReceiptRepository,
    private readonly ticketingService: TicketingService,
  ) {}

  async payBooking(request: {
    invoiceNo: string;
    paymentPhoneNo: string;
    emailTo: string;
  }): Promise<string> {
    const pay = await this.paymentRequestRepository.new({
      ...request,
      status: PaymentStatus.INPROGRESS,
    });
    if (!pay) {
      throw new MicroServiceException(
        `Unable to initiate payment collection for the invoice no ${request.invoiceNo}`,
        RpcExceptionCode.PAYMENT_COLLECTION_EXCEPTION,
      );
    }
    // TODO: Call 3rd-party service provider to initiate collection
    return pay._id.toString();
  }

  async payConfirmation(response: {
    id: string;
    amount: number;
    thirdPartyId: string;
  }) {
    const request = await this.paymentRequestRepository.get(response.id);
    if (!request) {
      throw new MicroServiceException(
        `Payment request id ${response.id} doesnt exist`,
        RpcExceptionCode.PAYMENT_COLLECTION_EXCEPTION,
      );
    }
    const invoice = await this.invoiceRepository.get(request.invoiceNo);
    if (!invoice) {
      throw new MicroServiceException(
        `Payment request id ${response.id} invoice no ${request.invoiceNo} doesnt exist`,
        RpcExceptionCode.PAYMENT_COLLECTION_EXCEPTION,
      );
    }
    const receipt = await this.receiptRepository.new({
      amount: response.amount,
      invoiceNo: request.invoiceNo,
      paymentPhoneNo: request.paymentPhoneNo,
      emailTo: request.emailTo,
    });
    if (!receipt) {
      throw new MicroServiceException(
        `Unable to create receipt for invoice ${request.invoiceNo}`,
        RpcExceptionCode.PAYMENT_COLLECTION_EXCEPTION,
      );
    }
    const emailTo = request.emailTo;
    this.sendReceipt(emailTo, receipt);
    const totalPaid = await this.receiptRepository.total(request.invoiceNo);
    const balance = totalPaid - invoice.amount;
    if (balance < 0) {
      this.sendRequestToPayBalance(emailTo, invoice, balance);
      throw new MicroServiceException(
        `Unable to create  ${request.invoiceNo}`,
        RpcExceptionCode.PAYMENT_COLLECTION_EXCEPTION,
      );
    }
    this.ticketingService.createAndSendTickets(emailTo, invoice);
  }

  sendReceipt(emailTo: string, receipt: Receipt) {
    // TODO: send reciept, IO-bound
  }

  sendRequestToPayBalance(emailTo: string, invoice: Invoice, amount: number) {
    // TODO: send notification, IO-bound
  }
}
