import { ApiProperty } from '@nestjs/swagger';
import { Prisma, UserType } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @IsString()
  @ApiProperty({
    enum: UserType,
  })
  type: Prisma.UserUpdateInput['type'];
}
