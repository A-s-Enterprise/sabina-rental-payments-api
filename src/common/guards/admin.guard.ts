import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User, UserType } from '@prisma/client';
import { Request } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextHttp = context.switchToHttp();
    const reqUser = contextHttp.getRequest<Request>().user as User;
    const user = await this.userService.findById(reqUser?.id ?? '');

    return user?.type == UserType.ADMIN;
  }
}
