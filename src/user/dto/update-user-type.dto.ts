import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateUserTypeDto {
  @IsString()
  @ApiProperty({
    enum: UserType,
  })
  type: UserType;
}
