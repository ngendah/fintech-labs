import { HttpStatus, HttpException } from '@nestjs/common';
import { catchError, throwError } from 'rxjs';
import {
  RpcExceptionCode,
  RpcExceptionCodeToHttpStatusCode,
} from 'libs/shared/rpc-exception';

export function rpcErrorInterceptor(): any {
  return catchError((err) => {
    let message = 'internal server error';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (typeof err === 'string') {
      message = err;
    } else if (typeof err === 'object' && err !== null) {
      const code = err['code'];
      message = (err['message'] as string) ?? message;
      status =
        RpcExceptionCodeToHttpStatusCode[code as RpcExceptionCode] ?? status;
    }
    return throwError(() => new HttpException(message, status));
  });
}
