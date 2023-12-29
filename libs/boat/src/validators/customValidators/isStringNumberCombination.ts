import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { startCase } from 'lodash';

@ValidatorConstraint({ async: true })
export class IsStringNumberCombinationConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: any) {
    const regExp = /^[A-Za-z0-9]*$/;
    return regExp.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${startCase(
      args.property,
    )} should contain letters or numbers only.`;
  }
}

export function IsStringNumberCombination(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsStringNumberCombinationConstraint,
    });
  };
}
