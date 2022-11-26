import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { Prisma, RoomType } from '@prisma/client';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Injectable()
export class RoomTypeService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<RoomType> {
    return this.prisma.roomType.findUnique({ where: { id } });
  }

  findByIdOrThrow(id: string): Promise<RoomType> {
    return this.prisma.roomType.findUniqueOrThrow({ where: { id } });
  }

  create(data: CreateRoomTypeDto): Promise<RoomType> {
    return this.prisma.roomType.create({
      data,
    });
  }

  update(
    where: Prisma.RoomTypeWhereUniqueInput,
    data: UpdateRoomTypeDto,
  ): Promise<RoomType> {
    return this.prisma.roomType.update({
      where,
      data,
    });
  }

  updateById(id: string, data: UpdateRoomTypeDto): Promise<RoomType> {
    return this.update(
      {
        id,
      },
      data,
    );
  }

  async delete(id: string): Promise<RoomType> {
    // can't delete a room type
    // if a room is base on this 'room type'
    const roomType = await this.prisma.roomType.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        _count: {
          select: { rooms: true },
        },
      },
    });

    if (roomType?._count?.rooms) {
      throw new BadRequestException('room type has existing rooms.');
    }

    return roomType;
  }
}
