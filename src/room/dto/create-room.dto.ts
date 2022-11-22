import { IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsNameAlreadyExist } from '../../common/validators/IsNameAlreadyExist';

export class CreateRoomDto {
  @IsString()
  @ApiProperty()
  @IsNameAlreadyExist()
  name: string;

  @IsString()
  @ApiProperty()
  floorId: string;

  @IsString()
  @ApiProperty()
  roomTypeId: string;

  @IsInt()
  @Min(2)
  @Max(5)
  @ApiProperty()
  tenantOccupancyLimit: number = 2;

  @IsEnum(Status)
  @ApiProperty()
  status?: Status = 'INACTIVE';
}
