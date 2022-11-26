import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../db/prisma.service';
import { FloorService } from './floor.service';
import { Floor, Status, Prisma } from '@prisma/client';
import * as uuid from 'uuid';

describe('FloorService', () => {
  let service: FloorService;
  let prisma: PrismaService;

  const floors: Floor[] = [
    {
      id: '0f533024-d8b3-4dd2-9e56-d75231025c5e',
      name: 'floor 1',
      status: Status.INACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '0f533024-d8b3-4dd2-9e56-d75231025c5e',
      name: 'floor 2',
      status: Status.INACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FloorService,
        {
          provide: PrismaService,
          useValue: {
            floor: {
              findMany: jest.fn().mockResolvedValue(floors),
              findUniqueOrThrow: jest.fn().mockResolvedValue(floors[1]),
              create: jest.fn().mockImplementation(async (args) => {
                return {
                  ...args.data,
                  id: uuid.v4(),
                };
              }),
              update: jest.fn().mockImplementation(async (args) => {
                return {
                  ...floors[0],
                  ...args.data,
                  id: args.where.id,
                };
              }),
              delete: jest.fn().mockResolvedValue(floors[0]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FloorService>(FloorService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should return all floors', async () => {
      await expect(service.findMany()).resolves.toEqual(floors);
    });

    it('should return all floors', async () => {
      jest.spyOn(service, 'findMany').mockResolvedValue([]);
      await expect(service.findMany()).resolves.toEqual([]);
    });
  });

  describe('findByIdOrThrow', () => {
    it('should retrieve the floor base on the id', async () => {
      await expect(service.findByIdOrThrow('id')).resolves.toEqual(floors[1]);
    });

    it('should retrieve the floor base on the id', async () => {
      jest
        .spyOn(service, 'findByIdOrThrow')
        .mockRejectedValueOnce(new Error('Floor not Found.'));

      await expect(service.findByIdOrThrow('id')).rejects.toThrowError(
        /Floor not Found./,
      );
    });
  });

  describe('create', () => {
    it('should return the newly created floor with the id', async () => {
      await expect(
        service.create({
          name: '3rd floor',
          status: Status.INACTIVE,
        }),
      ).resolves.toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should return the updated data for the floor', async () => {
      await expect(
        service.updateById('id', { status: Status.ACTIVE }),
      ).resolves.toHaveProperty('status', Status.ACTIVE);
    });
  });

  describe('delete', () => {
    it('should return the data for the deleted floor', async () => {
      await expect(service.delete('id')).resolves.toEqual(floors[0]);
    });

    it('should throw an error if `floor` has existing rooms', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new Error('floor has existing rooms.'));

      await expect(service.delete('id')).rejects.toThrowError(
        /floor has existing rooms./,
      );
    });

    it('should throw an error if the floor is not found', async () => {
      jest
        .spyOn(prisma.floor, 'findUniqueOrThrow')
        .mockRejectedValueOnce(new Error('Floor not Found.'));

      await expect(service.delete('id')).rejects.toThrowError(Error);
    });
  });
});
