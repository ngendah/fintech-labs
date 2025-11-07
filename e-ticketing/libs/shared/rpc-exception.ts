import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export enum RpcExceptionCode {
  USER_EXISTS = 1,
  USER_NOT_FOUND = 2,
  INVALID_CREDENTIALS = 3,
  BOOKING_EXCEPTION = 4,
  PAYMENT_COLLECTION_EXCEPTION = 5,
}

export class MicroServiceException extends RpcException {
  constructor(message: string, code: RpcExceptionCode) {
    super({ message, code });
  }
}

export const RpcExceptionCodeToHttpStatusCode = {
  [RpcExceptionCode.USER_EXISTS]: HttpStatus.FORBIDDEN,
  [RpcExceptionCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [RpcExceptionCode.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [RpcExceptionCode.BOOKING_EXCEPTION]: HttpStatus.BAD_REQUEST,
  [RpcExceptionCode.PAYMENT_COLLECTION_EXCEPTION]: HttpStatus.BAD_REQUEST,
};
