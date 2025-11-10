import { UserId } from './user.dto';

export interface PayDto {
  invoiceNo: string;
  paymentPhoneNo: string;
  emailTo: string;
}

export interface UserPayDto extends UserId, PayDto {}

export interface PayResultDto {
  id: string;
  amount: number;
  thirdPartyId: string;
}
