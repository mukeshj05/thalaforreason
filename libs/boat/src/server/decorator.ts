import 'reflect-metadata';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ResponseSerializer } from './serializer';

export const Serializer = createParamDecorator(
  (data: string, ctx: ExecutionContext): ResponseSerializer => {
    const request = ctx.switchToHttp().getRequest();
    return request._responseSerializer;
  },
);
