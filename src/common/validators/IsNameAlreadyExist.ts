import { Injectable, Optional } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  registerDecorator,
} from 'class-validator';
import { FloorService } from '../../floor/floor.service';
import { RoomTypeService } from '../../room-type/room-type.service';
import { RoomService } from '../../room/room.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsNameAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @Optional() private readonly floorService?: FloorService,
    @Optional() private readonly roomTypeService?: RoomTypeService,
    @Optional() private readonly roomService?: RoomService,
  ) {}

  async validate(value: string, args?: ValidationArguments): Promise<boolean> {
    const dtoName = args.targetName.toLowerCase();

    if (dtoName.includes('floor') && this.floorService) {
      return !(await this.floorService.findByName(value));
    }

    if (dtoName.includes('room') && this.roomService) {
      return !(await this.roomService.findByName(value));
    }

    if (dtoName.includes('roomtype') && this.roomTypeService) {
      return !(await this.roomTypeService.findByName(value));
    }

    return false;
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
