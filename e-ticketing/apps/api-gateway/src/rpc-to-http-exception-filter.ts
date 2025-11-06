import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

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
      status = this.mapErrorCodeToStatus(error['code']);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
    });
  }

  private mapErrorCodeToStatus(code?: string): HttpStatus {
    switch (code) {
      case 'USER_EXISTS':
        return HttpStatus.FORBIDDEN;
      case 'USER_NOT_FOUND':
        return HttpStatus.NOT_FOUND;
      case 'INVALID_CREDENTIALS':
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
