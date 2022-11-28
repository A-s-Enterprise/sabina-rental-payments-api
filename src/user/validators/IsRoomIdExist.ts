import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../db/prisma.service';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsRoomIdExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: string): Promise<boolean> {
    return !!this.prisma.room.findUnique({ where: { id } });
  }

  defaultMessage(): string {
    return '$property $value does not exist.';
  }
}

export const IsRoomIdExist = (options?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      constraints: [],
      options,
      propertyName,
      validator: IsRoomIdExistConstraint,
    });
  };
};
