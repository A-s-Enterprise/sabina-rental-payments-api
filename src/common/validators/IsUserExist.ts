import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: string): Promise<boolean> {
    return !!(await this.prisma.user.findUnique({ where: { id } }));
  }

  defaultMessage(): string {
    return 'user with $property $value does not exist.';
  }
}

export const IsUserExist = (options?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options,
      validator: IsUserExistConstraint,
    });
  };
};
