export class MerchantDto {
  accountNumber: string;
  countryCode: string;
  name: string;
}

export class DepositDto {
  ref: string;
  amount: number;
  currency: string;
  telco: string;
  mobileNumber: string;
  date: string;
}

export class StkPushRequestDto extends DepositDto {
  callbackUrl: string;
  pushType: string;
}

export class StkPushResponseDto {
  status: boolean;
  code: number;
  message: string;
  reference: string;
  transactionId: string;
}

export class DepositConfirmationDto {
  status: boolean;
  code: number;
  message: string;
  transactionReference: string;
  telcoReference: string;
  mobileNumber: string;
  debitedAmount: number;
  requestAmount: number;
  charge: number;
  currency: string;
  telco: string;
}
