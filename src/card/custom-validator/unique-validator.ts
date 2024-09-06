import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';

@ValidatorConstraint({ async: true })
export class IsUniqueUsername implements ValidatorConstraintInterface {
  async validate(username: string, args: ValidationArguments) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { username } });
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Username $value already exists. Choose another username.';
  }
}

export function Unique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueUsername,
    });
  };
}
