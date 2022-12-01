import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsFloorIdExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: string): Promise<boolean> {
    return !!(await this.prisma.floor.findUnique({ where: { id } }));
  }

  defaultMessage(): string {
    return "Floor with id '$value' does not exist.";
  }
}

export const IsFloorIdExist = (options?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      constraints: [],
      propertyName,
      options,
      validator: IsFloorIdExistConstraint,
    });
  };
};
