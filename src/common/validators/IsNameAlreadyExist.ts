import { Injectable, Optional } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  registerDecorator,
} from 'class-validator';
import { PrismaService } from '../../db/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsNameAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: string, args?: ValidationArguments): Promise<boolean> {
    const model = args.targetName
      .toLowerCase()
      .replace(/create|update|dto/g, '')
      .replace('t', 'T');

    const result = await this.prisma[model]?.findUnique({
      where: {
        name: value,
      },
    });

    return !result;
  }

  defaultMessage(): string {
    return "$property '$value' already exists. Please try another one.";
  }
}

export const IsNameAlreadyExist = (options?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options,
      validator: IsNameAlreadyExistConstraint,
    });
  };
};
