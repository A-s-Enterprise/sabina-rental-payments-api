import { Injectable } from '@nestjs/common';
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

  findByName(name: string): Promise<RoomType> {
    return this.prisma.roomType.findFirst({
      where: {
        name,
      },
    });
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
}
