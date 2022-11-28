import { Post, Body, Put, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';

import { ControllerWithAuth } from '../common/decorators/controller-with-auth.controller';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@ControllerWithAuth('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.findMany();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findByIdOrThrow(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateById(id, updateUserDto);
  }

  @Put(':id/type')
  updateUserStatus(@Param('id') id: string, @Body() dto: UpdateUserTypeDto) {
    return this.userService.updateUserType(id, dto.type);
  }

  @Put(':id/status')
  updateUserType(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.userService.updateUserStatus(id, dto.status);
  }
}
