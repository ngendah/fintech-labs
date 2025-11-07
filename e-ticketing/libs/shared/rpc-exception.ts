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
