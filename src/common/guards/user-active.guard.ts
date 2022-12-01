import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Status, User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class UserActiveGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextHttp = context.switchToHttp();
    const reqUser = contextHttp.getRequest<Request>().user as User;
    const user = await this.prisma.user.findUnique({
      where: { id: reqUser?.id ?? '' },
    });

    return user?.status == Status.ACTIVE;
  }
}
