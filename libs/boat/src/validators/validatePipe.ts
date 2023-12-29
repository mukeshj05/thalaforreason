import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { startCase } from 'lodash';
import { ValidationFailed } from '../exceptions';
import { VALIDATE_KEY, VALIDATE_OPTIONS } from './decorator';

@Injectable()
export class ValidationPipe implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const schema = this.reflector.getAllAndOverride(VALIDATE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const options = this.reflector.getAllAndOverride(VALIDATE_OPTIONS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!schema) {
      return true;
    }

    const object = plainToInstance(schema, req.all());

    const errors = await validate(object, {
      stopAtFirstError: true,
      ...options,
    });
    if (errors.length > 0) {
      const errorObj = {};
      for (const error of errors) {
        for (const constraint in error.constraints) {
          let message = error.constraints[constraint];
          message = message.replace(error.property, startCase(error.property));

          errorObj[error.property] = message;
        }
      }
      throw new ValidationFailed(errorObj);
    }
    req._dto = object;

    return true;
  }
}
