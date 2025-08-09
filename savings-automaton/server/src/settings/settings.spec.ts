import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JengaSettings, AUTHENTICATION, STK_PUSH } from './settings';
import { SettingsModule } from './settings.module';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const loadConfiguration = (): Record<string, any> => {
  const YAML_CONFIG_FILENAME = 'config.example.yaml';
  const file = readFileSync(
    join(__dirname, '../../', YAML_CONFIG_FILENAME),
    'utf8',
  );
  return yaml.load(file) as Record<string, any>;
};

describe('SettingsService', () => {
  let jengaSettings: JengaSettings;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [loadConfiguration],
        }),
        SettingsModule,
      ],
    }).compile();
    jengaSettings = module.get(JengaSettings);
  });

  it('should be defined', () => {
    expect(jengaSettings).toBeDefined();
  });

  it('should return a valid callback URL', () => {
    const url = new URL('/daraja', 'http://localhost:8000');
    expect(jengaSettings.callbackUrl()).toBe(url.href);
  });

  it('should return a valid token endpoint (URL instance)', () => {
    const url = new URL(AUTHENTICATION, 'https://uat.finserve.africa');
    expect(jengaSettings.tokenEndpoint()).toBe(url.href);
  });

  it('should return a valid STK push endpoint (URL instance)', () => {
    const url = new URL(STK_PUSH, 'https://uat.finserve.africa');
    expect(jengaSettings.stkPushEndpoint()).toBe(url.href);
  });

  it('should return merchant details (MerchantDto)', () => {
    const details = jengaSettings.merchantDetails();
    expect(details).toBeDefined();
    expect(details.accountNumber).toBe('0987654321');
    expect(details.countryCode).toBe('KEN');
    expect(details.name).toBe('testing-account');
  });

  it('should return the merchant code (string)', () => {
    expect(jengaSettings.merchantCode()).toBe('123456');
  });

  it('should return the merchant secret (string)', () => {
    expect(jengaSettings.merchantSecret()).toBe('sk_consumer_secret');
  });

  it('should return the STK push type (string)', () => {
    expect(jengaSettings.stkPushType()).toBe('USSD');
  });

  it('should return the API key (string)', () => {
    expect(jengaSettings.apiKey()).toBe('sk_api_key');
  });
});
