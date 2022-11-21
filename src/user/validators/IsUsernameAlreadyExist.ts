import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UserService) {}

  async validate(value: string): Promise<boolean> {
    return !(await this.userService.findByUsername(value));
  }

  defaultMessage(): string {
    return `$property '$value' already exists. Please use another one.`;
  }
}

export const IsUsernameAlreadyExist = (options?: ValidationOptions) => {
  return function (obj: Object, propertyName: string) {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsUsernameAlreadyExistConstraint,
    });
  };
};
