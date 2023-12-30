import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsUniqueInterface } from '../types/unique.type';
import { IsUniqueConstraint } from '../validators/is-unique-constraint.validator';

export function isUnique(
  options: IsUniqueInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
