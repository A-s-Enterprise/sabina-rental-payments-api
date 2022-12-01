import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
  registerDecorator,
} from 'class-validator';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsRoomTypeIdExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: string): Promise<boolean> {
    return !!(await this.prisma.roomType.findUnique({ where: { id } }));
  }

  defaultMessage(): string {
    return "Roomtype with id '$value' does not exist.";
  }
}

export const IsRoomTypeIdExist = (options?: ValidatorOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      options,
      propertyName,
      constraints: [],
      validator: IsRoomTypeIdExistConstraint,
    });
  };
};
