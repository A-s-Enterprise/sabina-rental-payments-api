import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status, UserType } from '@prisma/client';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { IsEmailAlreadyExist } from '../validators/IsEmailUserAlreadyExist';
import { IsRoomFull } from '../validators/IsRoomFull';
import { IsRoomIdExist } from '../validators/IsRoomIdExist';
import { IsUsernameAlreadyExist } from '../validators/IsUsernameAlreadyExist';

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  middleName?: string;

  @IsString()
  @MaxLength(30)
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @MaxLength(50)
  @IsEmailAlreadyExist()
  @ApiProperty()
  email: string;

  @IsString()
  @MaxLength(50)
  @IsUsernameAlreadyExist()
  @ApiProperty()
  userName: string;

  @IsString()
  @IsRoomIdExist()
  @IsRoomFull()
  roomId: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  avatarUrl?: string;

  @IsDateString()
  dateOfBirth: string | Date;

  @IsEnum(Status)
  @IsOptional()
  status: Status = 'INACTIVE';

  @IsEnum(UserType)
  @IsOptional()
  type?: UserType = 'TENANT';
}
