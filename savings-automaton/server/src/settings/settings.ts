import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MerchantDto } from 'src/partners/jenga/dto/jenga.dto';

export const AUTHENTICATION = 'authentication/api/v3/authenticate/merchant';
export const STK_PUSH = 'v3-apis/payment-api/v3.0/stkussdpush/initiate';

@Injectable()
export class JengaSettings {
  constructor(private config: ConfigService) {}

  callbackUrl(): string {
    const apiDomain = this.config.get<string>('api.domain');
    if (!apiDomain) {
      throw new Error('Configuration error, api.domain not defined');
    }
    const callbackPath = this.config.get<string>('jenga.callback_path');
    if (!callbackPath) {
      throw new Error('Configuration error, jenga.callback_path not defined');
    }
    return new URL(callbackPath, apiDomain).href;
  }

  tokenEndpoint(): string {
    return new URL(AUTHENTICATION, this.config.get<string>('jenga.api_base'))
      .href;
  }

  stkPushEndpoint(): string {
    return new URL(STK_PUSH, this.config.get<string>('jenga.api_base')).href;
  }

  merchantDetails(): MerchantDto {
    return {
      name: this.config.get<string>('jenga.bank_account.name'),
      accountNumber: this.config.get<string>('jenga.bank_account.number'),
      countryCode: this.config.get<string>('jenga.bank_account.country_code'),
    } as MerchantDto;
  }

  merchantCode() {
    return this.config.get<string>('jenga.merchant_code');
  }

  merchantSecret() {
    return this.config.get<string>('jenga.consumer_secret');
  }

  stkPushType(): string {
    const pushType = this.config.get<string>('jenga.stk.push_type');
    if (!pushType) {
      throw new Error('Configuration error, jenga.stk.push_type not defined');
    }
    return pushType;
  }

  apiKey(): string {
    const apiKey = this.config.get<string>('jenga.api_key');
    if (!apiKey) {
      throw new Error('Configuration jenga.api_key not found');
    }
    return apiKey;
  }
}

@Injectable()
export class ApiSettings {
  constructor(private config: ConfigService) {}
}
