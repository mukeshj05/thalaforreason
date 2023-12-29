import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { ValidationPipe } from './validatePipe';

interface ValidationOptions {
  whitelist?: boolean;
}

export const VALIDATE_KEY = 'validate';
export const VALIDATE_OPTIONS = 'validate_options';
export const Validate = (
  Dto: any,
  options: ValidationOptions = { whitelist: true },
) => {
  return applyDecorators(
    SetMetadata(VALIDATE_KEY, Dto),
    SetMetadata(VALIDATE_OPTIONS, options),
    UseGuards(ValidationPipe),
  );
};

// Dto decorator only works after validator decorator being used
export const Dto = createParamDecorator(
  (data: Record<string, any>, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req._dto;
  },
);
