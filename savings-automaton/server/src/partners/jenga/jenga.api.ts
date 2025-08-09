import { HttpStatus, Injectable } from '@nestjs/common';
import {
  StkPushRequestDto,
  StkPushResponseDto,
  DepositDto,
} from 'src/partners/jenga/dto/jenga.dto';
import { HttpService } from '@nestjs/axios';
import { JengaSettings } from 'src/settings/settings';

export const PUSH_CALL_SIGNATURE =
  'merchant.accountNumber+payment.ref+payment.mobileNumber+payment.telco+payment.amount+payment.currency';

@Injectable()
export class JengaApi {
  constructor(
    private settings: JengaSettings,
    private httpService: HttpService,
  ) {}

  axios() {
    return this.httpService.axiosRef;
  }

  async bearerToken(): Promise<{ token: string; expiresAt: Date }> {
    const response = await this.axios().post(
      this.settings.tokenEndpoint(),
      {
        merchantCode: this.settings.merchantCode(),
        merchantSecret: this.settings.merchantSecret(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.settings.apiKey(),
        },
      },
    );
    if (response.status != HttpStatus.OK) {
      throw new Error(response.statusText);
    }
    const json = (await response.data) as Record<string, any>;
    const token = json.token as string;
    const issuedAt = new Date(json.issuedAt);
    const expiresIn = json.expiresIn as number;
    return {
      token,
      expiresAt: new Date(
        issuedAt.setSeconds(issuedAt.getSeconds() + expiresIn),
      ),
    };
  }

  async pushDepositRequest(
    token: string,
    deposit: DepositDto,
  ): Promise<StkPushResponseDto> {
    const headers = {
      Authorization: `Bearer ${token}`,
      Signature: PUSH_CALL_SIGNATURE,
      'Content-Type': 'application/json',
    };
    const merchant = this.settings.merchantDetails();
    const payment: StkPushRequestDto = {
      ...deposit,
      callbackUrl: this.settings.callbackUrl(),
      pushType: this.settings.stkPushType(),
    };
    const response = await this.axios().post(
      this.settings.stkPushEndpoint(),
      { merchant, payment },
      {
        headers,
      },
    );
    if (response.status != HttpStatus.OK) {
      throw new Error(response.statusText);
    }
    const json = (await response.data) as StkPushResponseDto;
    if (!json.status) {
      throw new Error(json.message);
    }
    return json;
  }
}
