import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpPerformanceInterceptor implements NestInterceptor {
  private logger = new Logger(HttpPerformanceInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        const url = req.url;
        const duration = Date.now() - now;
        this.logger.debug(`[PERF] ${method} ${url} took ${duration}ms`);
      }),
    );
  }
}

@Injectable()
export class MicroservicePerformanceInterceptor implements NestInterceptor {
  private logger = new Logger(MicroservicePerformanceInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const handler = context.getHandler();
        const pattern =
          Reflect.getMetadata('microservices:pattern', handler) || 'unknown';
        const duration = Date.now() - now;
        this.logger.debug(`[PERF] Pattern "${pattern}" took ${duration}ms`);
      }),
    );
  }
}
