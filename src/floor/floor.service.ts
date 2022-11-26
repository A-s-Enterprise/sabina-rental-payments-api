import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { Floor, Prisma, Status } from '@prisma/client';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Injectable()
export class FloorService {
  constructor(private readonly prisma: PrismaService) {}

  findMany(args?: Prisma.FloorFindManyArgs) {
    return this.prisma.floor.findMany(args);
  }

  findOne(args: Prisma.FloorFindUniqueOrThrowArgs) {
    return this.prisma.floor.findUnique(args);
  }

  findByIdOrThrow(id: string): Promise<Floor> {
    return this.prisma.floor.findUniqueOrThrow({ where: { id } });
  }

  findById(id: string, include?: Prisma.FloorInclude) {
    return this.findOne({
      where: {
        id,
      },
      include,
    });
  }

  create(data: CreateFloorDto): Promise<Floor> {
    return this.prisma.floor.create({
      data,
    });
  }

  update(
    where: Prisma.FloorWhereUniqueInput,
    data: UpdateFloorDto,
  ): Promise<Floor> {
    return this.prisma.floor.update({
      where,
      data,
    });
  }

  updateById(id: string, data: UpdateFloorDto): Promise<Floor> {
    return this.update({ id }, data);
  }

  updateStatusById(id: string, status: Status): Promise<Floor> {
    return this.update({ id }, { status });
  }

  async delete(id: string): Promise<Floor> {
    const floor = await this.prisma.floor.findUniqueOrThrow({
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

    if (floor?._count?.rooms) {
      throw new BadRequestException('floor has existing rooms.');
    }

    return this.prisma.floor.delete({ where: { id } });
  }
}
