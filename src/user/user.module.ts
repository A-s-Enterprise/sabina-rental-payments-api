import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../db/database.module';
import { IsEmailAlreadyExistConstraint } from './validators/IsEmailUserAlreadyExist';
import { IsUsernameAlreadyExistConstraint } from './validators/IsUsernameAlreadyExist';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    IsEmailAlreadyExistConstraint,
    IsUsernameAlreadyExistConstraint,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
