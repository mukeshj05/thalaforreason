import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationFailed } from './validationFilter';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus() || 500;
    const message = exception.getStatus()
      ? exception.message || 'Something went wrong. Please try again later.'
      : 'Internal Server Error';

    if (exception instanceof ValidationFailed) {
      return response.status(status).json({
        success: false,
        code: status,
        message: message,
        errors: exception.getErrors(),
      });
    }

    response.status(status).json({
      success: false,
      code: status,
      message,
    });
  }
}

@Catch()
export class OtherExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 500;
    const message =
      exception.message || 'Something went wrong. Please try again later.';

    Logger.log('Error response', {
      ip: request.ip,
      url: request.url,
      host: request.hostname,
      method: request.method,
      body: request.body,
      query: request.query,
      params: request.params,
      cookies: request.cookies,
    });

    if (exception?.original?.code === '23502') {
      return response.status(status).json({
        success: false,
        code: 502,
        message: 'Some entities are missing. Please check.',
      });
    }

    response.status(status).json({
      success: false,
      code: status,
      message,
    });
  }
}
