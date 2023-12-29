import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ServerOptions } from './interface';
import { RequestGuard } from './guard';
import { logger, maintenance } from './middlewares';
import { HttpExceptionFilter, OtherExceptionFilter } from '../exceptions';

export class Server {
  static async create(module: any, options: ServerOptions = {}) {
    // creating nest application
    const app = await NestFactory.create(module);

    const config = app.get(ConfigService);

    // setting the container to used by class-validor for some dependency
    if (options.validatorContainer)
      useContainer(app.select(module), { fallbackOnErrors: true });

    // using cors
    app.enableCors({
      origin: options.corsOrigins || '*',
      credentials: true,
    });

    // using helmet
    app.use(helmet());

    // cookies parser
    app.use(cookieParser());

    // using globle guard for manupulating request and response objects
    app.useGlobalGuards(new RequestGuard());

    // loggin incoming requests
    app.use(logger);
    // checking for maintenance
    app.use(maintenance);

    // error handling
    app.useGlobalFilters(new HttpExceptionFilter(), new OtherExceptionFilter());

    // global route prefix
    if (options.globalPrefix) app.setGlobalPrefix(options.globalPrefix);

    // server listening port
    await app.listen(options.port || config.get<string>('APP_PORT'));
  }
}
