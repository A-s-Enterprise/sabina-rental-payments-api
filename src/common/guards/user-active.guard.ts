import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Status, User } from '@prisma/client';
import { Request } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserActiveGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextHttp = context.switchToHttp();
    const reqUser = contextHttp.getRequest<Request>().user as User;
    const user = await this.userService.findById(reqUser?.id ?? '');

    return user?.status == Status.ACTIVE;
  }
}
