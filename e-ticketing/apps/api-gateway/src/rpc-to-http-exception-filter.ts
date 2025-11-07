import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcExceptionCodeToHttpStatusCode } from 'libs/shared/rpc-exception';

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const error = exception.getError();
    let message = 'Internal server error';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (typeof error === 'string') {
      message = error;
    } else if (typeof error === 'object' && error !== null) {
      message = error['message'] ?? message;
      status =
        RpcExceptionCodeToHttpStatusCode[error['code']] ??
        HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
    });
  }
}
