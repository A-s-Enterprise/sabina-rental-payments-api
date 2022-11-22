import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { Floor, Prisma } from '@prisma/client';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Injectable()
export class FloorService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string, include?: Prisma.FloorInclude) {
    return this.prisma.floor.findUnique({
      where: { id },
      include: { rooms: true },
    });
  }

  findByName(name: string): Promise<Floor> {
    return this.prisma.floor.findFirst({ where: { name } });
  }

  create(data: CreateFloorDto): Promise<Floor> {
    return this.prisma.floor.create({
      data,
    });
  }

  update(where: any, data: UpdateFloorDto): Promise<Floor> {
    return this.prisma.floor.update({
      where,
      data,
    });
  }

  updateById(id: string, data: UpdateFloorDto): Promise<Floor> {
    return this.update({ id }, data);
  }

  async deleteById(id: string) {
    const floor = await this.prisma.floor.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            rooms: true,
          },
        },
      },
    });

    if (!floor) {
      throw new BadRequestException('floor does not exist.');
    }

    if (floor._count.rooms) {
      throw new BadRequestException('floor has existing rooms.');
    }

    return this.prisma.floor.delete({ where: { id } });
  }
}
