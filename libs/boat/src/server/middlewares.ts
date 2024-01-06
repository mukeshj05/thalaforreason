import { NextFunction } from 'express';
import { Request, Response } from './interface';

export function maintenance(req: Request, res: Response, next: NextFunction) {
  if (process.env.UNDER_MAINTENANCE === 'true') {
    return res.error('App under maintenance.', 503);
  }
  next();
}
