import { Test } from '@nestjs/testing';
import { Status } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { RoomTypeService } from './room-type.service';

describe('RoomTypeService Integration', () => {
  let roomTypeService: RoomTypeService;
  let prisma: PrismaService;
  let floor, roomType, roomType2;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService, RoomTypeService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    roomTypeService = module.get<RoomTypeService>(RoomTypeService);

    floor = await prisma.floor.create({
      data: {
        name: '1st',
        status: Status.ACTIVE,
      },
    });

    roomType = await roomTypeService.create({
      name: 'double deck',
      amount: 2000,
    });

    roomType2 = await roomTypeService.create({
      name: 'apartment',
      amount: 5000,
    });

    await prisma.room.createMany({
      data: [
        {
          floorId: floor.id,
          name: 'one',
          roomTypeId: roomType.id,
          status: Status.ACTIVE,
          tenantOccupancyLimit: 2,
        },
        {
          floorId: floor.id,
          name: 'two',
          roomTypeId: roomType2.id,
          status: Status.INACTIVE,
          tenantOccupancyLimit: 2,
        },
      ],
    });
  });

  it("should return null when finding a roomType that doesn't exist", async () => {
    await expect(roomTypeService.findById('idd')).resolves.toBeNull();
  });

  it('should return the details of the roomType', async () => {
    await expect(roomTypeService.findById(roomType2.id)).resolves.toEqual(
      roomType2,
    );
  });

  it("should throw an error when finding a roomType that doesn't exist", async () => {
    await expect(roomTypeService.findByIdOrThrow('idd')).rejects.toThrowError();
  });

  it('should return the details of the roomType', async () => {
    await expect(roomTypeService.findByIdOrThrow(roomType.id)).resolves.toEqual(
      roomType,
    );
  });

  it('should throw when creating a roomType that has a duplicate "name"', async () => {
    await expect(
      roomTypeService.create({
        name: 'double deck',
        amount: 2500,
      }),
    ).rejects.toThrowError();
  });

  it('should return the details of the newly created roomType', async () => {
    await expect(
      roomTypeService.create({
        name: 'single',
        amount: 1000,
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should throw when updating a roomType that has a duplicate "name"', async () => {
    await expect(
      roomTypeService.update(roomType2.id, {
        name: 'double deck',
        amount: 2500,
      }),
    ).rejects.toThrowError();
  });

  it('should return the details of updated roomType', async () => {
    await expect(
      roomTypeService.updateById(roomType.id, {
        amount: 2500,
      }),
    ).resolves.toHaveProperty('amount', 2500);
  });

  it("should throw an error when deleting a roomType that doesn't exist", async () => {
    await expect(roomTypeService.delete('error-id')).rejects.toThrowError();
  });

  it('should throw an error when deleting a roomType that has existing rooms', async () => {
    await expect(roomTypeService.delete(roomType.id)).rejects.toThrowError();
  });

  it('should throw an error when deleting a roomType that has existing rooms', async () => {
    await expect(roomTypeService.delete(roomType2.id)).rejects.toThrowError();
  });

  it('should return the details of the deleted roomType', async () => {
    await prisma.room.delete({
      where: {
        name: 'one',
      },
    });

    await expect(roomTypeService.delete(roomType.id)).resolves.not.toBeNull();
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.room.deleteMany(),
      prisma.roomType.deleteMany(),
      prisma.floor.deleteMany(),
    ]);
    await prisma.$disconnect();
  });
});
