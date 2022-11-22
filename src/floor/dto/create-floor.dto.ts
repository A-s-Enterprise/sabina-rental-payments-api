import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { IsNameAlreadyExist } from '../../common/validators/IsNameAlreadyExist';

export class CreateFloorDto {
  @IsString()
  @ApiProperty()
  @IsNameAlreadyExist()
  name: string;

  @IsEnum(Status)
  @ApiProperty({ required: false })
  @IsOptional()
  status?: Status = 'INACTIVE';
}
