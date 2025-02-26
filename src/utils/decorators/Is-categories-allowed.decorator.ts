import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCategoriesAllowed(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCategoriesAllowed',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { platform } = args.object as any;
          return platform !== undefined || value === undefined;
        },
        defaultMessage() {
          return 'categories cannot be provided without platform';
        },
      },
    });
  };
}
