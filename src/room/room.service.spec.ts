import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { PrismaService } from './../db/prisma.service';
import { Room, Status } from '@prisma/client';
import * as uuid from 'uuid';

describe('RoomService', () => {
  let service: RoomService;

  const rooms: Room[] = [
    {
      id: '38c1d40a-230b-4d11-93cc-d32c17c9f6cc',
      floorId: 'baddb906-4b6e-4041-aff7-ca49e1b2b6cc',
      roomTypeId: 'ce8b7547-e012-4e40-a8f9-fbe3b8517e7c',
      name: 'one',
      tenantOccupancyLimit: 2,
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '9cc552aa-98ec-476b-9332-ea7066abbe99',
      floorId: 'baddb906-4b6e-4041-aff7-ca49e1b2b6cc',
      roomTypeId: 'ce8b7547-e012-4e40-a8f9-fbe3b8517e7c',
      name: 'two',
      tenantOccupancyLimit: 2,
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3aa2974f-423a-4efa-9fdd-497a0f6d59ee',
      floorId: '0100f0bf-9c51-4d80-a6f9-54bc0d6b8fa5',
      roomTypeId: 'ce8b7547-e012-4e40-a8f9-fbe3b8517e7c',
      name: 'three',
      tenantOccupancyLimit: 3,
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '9668ee3e-4a07-4ee6-b9eb-4784ba08a4af',
      floorId: 'f6d81371-f680-4edf-a2bc-3c8b2cb2b2ee',
      roomTypeId: '53c2bc7d-a3ca-4a31-8dd3-74d722d12e5a',
      name: 'four',
      tenantOccupancyLimit: 3,
      status: Status.INACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: PrismaService,
          useValue: {
            room: {
              findMany: jest.fn().mockResolvedValue(rooms),
              findUnique: jest.fn().mockResolvedValue(rooms[0]),
              create: jest.fn().mockImplementation(async (data) => {
                return {
                  ...data,
                  id: uuid.v4(),
                };
              }),
              update: jest.fn().mockResolvedValue(rooms[3]),
              delete: jest.fn().mockResolvedValue(rooms[4]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should retrieve many rooms', async () => {
      await expect(service.findMany({})).resolves.toEqual(rooms);
    });
  });

  describe('findOne', () => {
    describe('findById', () => {
      it('should return the `room` base on the id', async () => {
        await expect(
          service.findById('38c1d40a-230b-4d11-93cc-d32c17c9f6cc'),
        ).resolves.toEqual(rooms[0]);
      });
    });

    describe('findByName', () => {
      it('should return the `room` base on the name', async () => {
        await expect(service.findByName('one')).resolves.toEqual(rooms[0]);
      });
    });
  });

  describe('create', () => {
    it('should create a `room` with an `id` property', async () => {
      await expect(
        service.create({
          floorId: 'aa',
          roomTypeId: 'aaa',
          tenantOccupancyLimit: 2,
          name: 'five',
        }),
      ).resolves.toHaveProperty('id');
    });
  });

  describe('updateById', () => {
    it('should update the room ', async () => {
      await expect(
        service.updateById('test-id', { name: 'six' }),
      ).resolves.toEqual(rooms[3]);
    });
  });

  describe('delete', () => {
    it('should delete the room ', async () => {
      await expect(service.delete('id')).resolves.toEqual(rooms[4]);
    });
  });
});
