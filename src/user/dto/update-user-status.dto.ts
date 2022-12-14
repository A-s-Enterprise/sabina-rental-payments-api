import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @IsString()
  @ApiProperty({
    enum: Status,
  })
  status: Status;
}
