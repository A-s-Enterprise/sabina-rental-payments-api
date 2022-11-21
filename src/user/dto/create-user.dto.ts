import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional, IsEmail } from 'class-validator';
import { IsEmailAlreadyExist } from '../validators/IsEmailUserAlreadyExist';
import { IsUsernameAlreadyExist } from '../validators/IsUsernameAlreadyExist';

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  middleName?: string;

  @IsString()
  @MaxLength(30)
  @ApiProperty()
  lastName: string;

  @IsString()
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
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  avatarUrl?: string;

  @IsString()
  dateOfBirth: string;
}
