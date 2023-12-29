import { Logger } from '@nestjs/common';
import { NextFunction } from 'express';
import { Request, Response } from './interface';

export function logger(req: Request, res: Response, next: NextFunction) {
  Logger.log('Request', {
    ip: req.ip,
    url: req.url,
    host: req.hostname,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    cookies: req.cookies,
  });
  next();
}

export function maintenance(req: Request, res: Response, next: NextFunction) {
  if (process.env.UNDER_MAINTENANCE === 'true') {
    return res.error('App under maintenance.', 503);
  }
  next();
}
