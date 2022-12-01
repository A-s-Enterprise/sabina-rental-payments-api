import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsString, IsEnum, IsOptional, IsIn, IsInt } from 'class-validator';
import { IsNameAlreadyExist } from '../../common/validators/IsNameAlreadyExist';

export class CreateFloorDto {
  @IsString()
  @ApiProperty()
  @IsNameAlreadyExist()
  name: string;

  @IsEnum(Status)
  @ApiPropertyOptional()
  @IsOptional()
  status?: Status = 'INACTIVE';

  @IsInt()
  @ApiPropertyOptional()
  @IsOptional()
  roomLimit? = 5;
}
