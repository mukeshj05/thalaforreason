import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    const req = context.switchToHttp().getRequest();

    const requestCompleteTap = (data) => {
      Logger.log('API Logs', {
        request: {
          ip: req.ip,
          url: req.url,
          host: req.hostname,
          method: req.method,
          body: req.body,
          query: req.query,
          params: req.params,
          cookies: req.cookies,
        },
        response: {
          data,
          responseTime: Date.now() - startTime + 'ms',
        },
      });
    };

    return next.handle().pipe(tap(requestCompleteTap));
  }
}
