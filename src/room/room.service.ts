import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Room> {
    return this.prisma.room.findUnique({
      where: {
        id,
      },
    });
  }

  findByName(name: string): Promise<Room> {
    return this.prisma.room.findFirst({
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
}
