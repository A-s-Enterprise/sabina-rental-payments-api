import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User, UserType } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextHttp = context.switchToHttp();
    const reqUser = contextHttp.getRequest<Request>().user as User;
    const user = await this.prisma.user.findUnique({
      where: { id: reqUser?.id ?? '' },
    });

    return user?.type == UserType.ADMIN;
  }
}
