import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Status } from '@prisma/client';
import { readFileSync } from 'fs';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { JengaModule } from 'src/partners/jenga/jenga.module';
import { JengaService } from 'src/partners/jenga/jenga.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { request } from 'express';

const loadConfiguration = (): Record<string, any> => {
  const YAML_CONFIG_FILENAME = 'config.example.yaml';
  const file = readFileSync(
    join(__dirname, '../../../', YAML_CONFIG_FILENAME),
    'utf8',
  );
  return yaml.load(file) as Record<string, any>;
};

const mockHttpService = {
  axiosRef: {
    post: jest.fn(),
  },
};

describe('JengaService', () => {
  let service: JengaService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [loadConfiguration],
        }),
        JengaModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    service = module.get<JengaService>(JengaService);
    prisma = module.get(PrismaService);
  });

  it('should request user deposit', async () => {
    jest.spyOn(mockHttpService.axiosRef, 'post').mockImplementation((url, data) => {
      if (url.includes('authenticate')) {
        return {
          data: {
            token: '1234411',
            issuedAt: (new Date()).toISOString(),
            expiresIn: 100, // seconds
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
          request: data,

        }
      }
      if (url.includes('stkussdpush/initiate')) {
        return {
          data: {
            "status": true,
            "code": -1,
            "message": "Transaction has been successfully acknowledged, await final transaction status on callback",
            "reference": data.payment.ref,
            "transactionId": data.payment.ref
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
          request: data,
        }
      }
      return {
        status: 500,
      }
    })
    const response = await service.requestDeposit(
      {
        ref: '1819191',
        amount: 100,
        currency: 'KES',
        telco: 'Safaricom',
        mobileNumber: '+254600900800',
        date: new Date().toISOString()
      },
    )
    expect(response.status).toEqual(Status.INITIATED)
  });

  it('should fail to request user deposit if unable to obtain bearer token', async () => {
    jest.spyOn(mockHttpService.axiosRef, 'post').mockImplementation((url, data) => {
      if (url.includes('authenticate')) {
        return {
          data: {
            token: '1234411',
            issuedAt: (new Date()).toISOString(),
            expiresIn: 100, // seconds
          },
          status: 500,
          statusText: 'INTERNAL SERVER ERROR',
          headers: {},
          config: { url },
          request: data,

        }
      }
      return {
        status: 500,
      }
    });
    const response = await service.requestDeposit(
      {
        ref: '1819191',
        amount: 100,
        currency: 'KES',
        telco: 'Safaricom',
        mobileNumber: '+254600900800',
        date: new Date().toISOString()
      },
    )
    expect(response.status).toEqual(Status.FAILED)
    expect(response.message).toBeDefined()
  });

  it('should fail to request user deposit if request is not authorized', async () => {
    jest.spyOn(mockHttpService.axiosRef, 'post').mockImplementation((url, data) => {
      if (url.includes('authenticate')) {
        return {
          data: {
            token: '1234411',
            issuedAt: (new Date()).toISOString(),
            expiresIn: 100, // seconds
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
          request: data,

        }
      }
      if (url.includes('stkussdpush/initiate')) {
        return {
          data: {
            "status": false,
            "code": 106401,
            "message": "Not Authorized to access this Telco, Kindly contact",
            "reference": data.payment.ref,
            "transactionId": data.payment.ref
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url },
          request: data,
        }
      }
      return {
        status: 500,
      }
    })
    const response = await service.requestDeposit(
      {
        ref: '1819191',
        amount: 100,
        currency: 'KES',
        telco: 'Safaricom',
        mobileNumber: '+254600900800',
        date: new Date().toISOString()
      },
    )
    expect(response.status).toEqual(Status.FAILED)
    expect(response.message).toBeDefined()
  })

  it('should confirm user deposit when request is successful', async () => {
    // TODO:
  })
});
