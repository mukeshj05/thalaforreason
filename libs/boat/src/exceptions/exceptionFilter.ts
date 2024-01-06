import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationFailed } from './validationFilter';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : 500;
    const message =
      exception.getStatus && exception.getStatus()
        ? exception.message || 'Something went wrong. Please try again later.'
        : 'Internal Server Error';

    console.log(exception);

    Logger.log('Error response', {
      request: {
        ip: request.ip,
        url: request.url,
        host: request.hostname,
        method: request.method,
        body: request.body,
        query: request.query,
        params: request.params,
        cookies: request.cookies,
      },
      error: {
        status,
        message,
        exception,
      },
    });

    if (exception instanceof ValidationFailed) {
      return response.status(status).json({
        success: false,
        code: status,
        message: message,
        errors: exception.getErrors(),
      });
    }

    if (exception?.original?.code === 'ECONNREFUSED') {
      return response.status(status).json({
        success: false,
        code: 503,
        message: 'Database connection error.',
      });
    }

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
