import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { Prisma, Status, User, UserType } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findByIdOrThrow(id: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  findByUsernameOrThrow(userName: string) {
    return this.prisma.user.findFirstOrThrow({ where: { userName } });
  }

  findMany(args?: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findByUsername(userName: string) {
    return this.prisma.user.findUnique({
      where: { userName },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findTenantPayment(id: string, paymentId: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        payments: {
          where: {
            id: paymentId,
          },
        },
      },
    });
  }

  findTenantPayments(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        payments: true,
      },
    });
  }

  findTenantConversations(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        conversations: true,
      },
    });
  }

  findTenantConversationMessages(id: string, conversationId: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        conversations: {
          where: {
            conversationId,
          },
          include: {
            conversation: {
              include: {
                messages: true,
              },
            },
          },
        },
      },
    });
  }

  create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  update(data: Prisma.UserUpdateInput, where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.update({ data, where });
  }

  updateById(id: string, data: Prisma.UserUpdateInput) {
    return this.update(data, { id });
  }

  updateUserType(id: string, type: UserType) {
    return this.updateById(id, { type });
  }

  updateUserStatus(id: string, status: Status) {
    return this.updateById(id, { status });
  }

  async deleteById(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
