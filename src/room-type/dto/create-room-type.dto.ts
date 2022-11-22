import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { IsNameAlreadyExist } from '../../common/validators/IsNameAlreadyExist';

export class CreateRoomTypeDto {
  @IsString()
  @ApiProperty()
  @IsNameAlreadyExist()
  name: string;

  @IsInt()
  @ApiProperty()
  amount: number;
}
