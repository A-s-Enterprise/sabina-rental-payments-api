import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsFloorLimitReachedConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: string): Promise<boolean> {
    const floor = await this.prisma.floor.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            rooms: true,
          },
        },
        roomLimit: true,
      },
    });

    return !(!floor || floor._count.rooms + 1 > floor.roomLimit);
  }

  defaultMessage(): string {
    return 'floor has reach it room limit.';
  }
}

export const IsFloorLimitReached = (options?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options,
      validator: IsFloorLimitReachedConstraint,
    });
  };
};
