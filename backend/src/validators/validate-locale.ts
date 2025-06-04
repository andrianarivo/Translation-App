import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { validLocales } from '../utils/valid-locales';

export function ValidateLocale(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateLocale',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const [relatedPropertyName] = args.constraints;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            validLocales.includes(value) &&
            typeof relatedValue === 'string' &&
            validLocales.includes(relatedValue)
          );
        },
      },
    });
  };
}
