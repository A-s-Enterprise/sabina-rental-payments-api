import { IsString, IsInt, Min, Max, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsNameAlreadyExist } from '../../common/validators/IsNameAlreadyExist';
import { IsFloorIdExist } from '../validators/IsFloorIdExist';
import { IsRoomTypeIdExist } from '../validators/IsRoomTypeIdExist';
import { IsFloorLimitReached } from '../validators/IsFloorLimitReached';

export class CreateRoomDto {
  @IsString()
  @ApiProperty()
  @IsNameAlreadyExist()
  name: string;

  @IsString()
  @ApiProperty()
  @IsFloorIdExist()
  @IsFloorLimitReached()
  floorId: string;

  @IsString()
  @ApiProperty()
  @IsRoomTypeIdExist()
  roomTypeId: string;

  @IsInt()
  @Min(2)
  @Max(5)
  @ApiProperty()
  @IsOptional()
  tenantOccupancyLimit: number = 2;

  @IsEnum(Status)
  @ApiPropertyOptional()
  @IsOptional()
  status?: Status = 'INACTIVE';
}
