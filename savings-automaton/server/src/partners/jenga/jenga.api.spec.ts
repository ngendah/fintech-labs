import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JengaModule } from 'src/partners/jenga/jenga.module';
import { JengaApi, PUSH_CALL_SIGNATURE } from './jenga.api';
import { JengaSettings } from 'src/settings/settings';
import { HttpService } from '@nestjs/axios';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const loadConfiguration = (): Record<string, any> => {
  const YAML_CONFIG_FILENAME = 'config.example.yaml';
  const file = readFileSync(
    join(__dirname, '../../../', YAML_CONFIG_FILENAME),
    'utf8',
  );
  return yaml.load(file) as Record<string, any>;
};

const mockAxiosPost = jest.fn();

const mockHttpService = {
  axiosRef: {
    post: mockAxiosPost,
  },
  // If your service also used HttpService.get() or HttpService.post() directly,
  // beyond axiosRef, you would mock them here like:
  // get: jest.fn(),
  // post: () => of({} as AxiosResponse) // Example for HttpService's observable methods
};

describe('JengaApi', () => {
  let jengaApi: JengaApi;
  let jengaSettings: JengaSettings;

  beforeEach(async () => {
    mockAxiosPost.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [loadConfiguration],
        }),
        JengaModule,
      ],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    jengaApi = module.get(JengaApi);
    jengaSettings = module.get(JengaSettings);
  });

  it('should be defined', () => {
    expect(jengaApi).toBeDefined();
  });

  it('should return a valid bearer_token', async () => {
    const url = jengaSettings.tokenEndpoint();
    const now = new Date();
    const mockTokenResponse = {
      data: {
        token: '1234411',
        issuedAt: now.toISOString(),
        expiresIn: 100, // seconds
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url } as any,
      request: {},
    };
    mockAxiosPost.mockResolvedValueOnce(mockTokenResponse);
    const token = await jengaApi.bearerToken();
    expect(token).toBeDefined();
    expect(token.token).toBeDefined();
    expect(token.expiresAt).toBeDefined();
  });

  it('should call push_deposit_request with the correct parameters', async () => {
    mockAxiosPost.mockResolvedValue({
      data: { status: 'success', message: 'STK push initiated' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      request: {},
    });
    const now = new Date();
    const mobileNumber = '+254008007009';
    const token = '12341';
    await jengaApi.pushDepositRequest(token, {
      ref: 'akajda',
      amount: 100,
      currency: 'KES',
      telco: 'Safaricom',
      mobileNumber,
      date: now.toISOString(),
    });
    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
    const expectedEndpoint = jengaSettings.stkPushEndpoint();
    const expectedMerchantDetials = jengaSettings.merchantDetails();
    const expectedPayments = {
      amount: 100,
      callbackUrl: 'http://localhost:8000/daraja',
      currency: 'KES',
      date: now.toISOString(),
      mobileNumber,
      pushType: 'USSD',
      ref: 'akajda',
      telco: 'Safaricom',
    };
    const requestHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Signature: PUSH_CALL_SIGNATURE,
    };
    expect(mockAxiosPost).toHaveBeenCalledWith(
      expectedEndpoint,
      { merchant: expectedMerchantDetials, payment: expectedPayments },
      { headers: requestHeaders },
    );
  });
});
