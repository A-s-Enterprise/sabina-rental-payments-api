import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IsEmailAlreadyExistConstraint } from './validators/IsEmailUserAlreadyExist';
import { IsUsernameAlreadyExistConstraint } from './validators/IsUsernameAlreadyExist';
import { IsRoomIdExistConstraint } from './validators/IsRoomIdExist';
import { IsRoomFullConstraint } from './validators/IsRoomFull';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    IsEmailAlreadyExistConstraint,
    IsUsernameAlreadyExistConstraint,
    IsRoomIdExistConstraint,
    IsRoomFullConstraint,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
