import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../db/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsRoomFullConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: string): Promise<boolean> {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
      select: {
        _count: {
          select: {
            users: true,
          },
        },
        tenantOccupancyLimit: true,
      },
    });

    return !(!room || room._count.users + 1 > room.tenantOccupancyLimit);
  }

  defaultMessage(): string {
    return 'room has reach the maximum tenants.';
  }
}

export const IsRoomFull = (options?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options,
      validator: IsRoomFullConstraint,
    });
  };
};
