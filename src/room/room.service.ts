import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  findMany(args?: Prisma.RoomFindManyArgs) {
    return this.prisma.room.findMany(args);
  }

  findOne(args?: Prisma.RoomFindUniqueArgs) {
    return this.prisma.room.findUnique(args);
  }

  findByIdOrThrow(id: string): Promise<Room> {
    return this.prisma.room.findUniqueOrThrow({ where: { id } });
  }

  findById(id: string): Promise<Room> {
    return this.prisma.room.findUnique({ where: { id } });
  }

  findByName(name: string): Promise<Room> {
    return this.findOne({
      where: {
        name,
      },
    });
  }

  create(data: CreateRoomDto): Promise<Room> {
    return this.prisma.room.create({
      data,
    });
  }

  update(
    where: Prisma.RoomWhereUniqueInput,
    data: UpdateRoomDto,
  ): Promise<Room> {
    return this.prisma.room.update({
      where,
      data,
    });
  }

  updateById(id: string, data: UpdateRoomDto): Promise<Room> {
    return this.update({ id }, data);
  }

  async delete(id: string): Promise<Room> {
    // can't delete a room if
    // there's a tenant residing in that room
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (room?._count?.users) {
      throw new BadRequestException('room has existing tenants.');
    }

    return this.prisma.room.delete({ where: { id } });
  }
}
