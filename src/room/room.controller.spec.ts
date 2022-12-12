import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Room, Status } from '@prisma/client';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import * as uuid from 'uuid';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from './../db/prisma.service';

describe('RoomController', () => {
  let controller: RoomController;
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
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: RoomService,
          useValue: {
            findByIdOrThrow: async (id: string) => ({ ...rooms[1], id }),
            create: async (body: CreateRoomDto) => {
              return { ...body, id: uuid.v4() };
            },
            updateById: async (id: string, body: UpdateRoomDto) => {
              const room = rooms[2];
              return { ...room, ...body, id };
            },
            delete: async (id: string) => {
              return { ...rooms[0], id };
            },
          },
        },
        {
          provide: PrismaService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findById', () => {
    it('should return the `room` base on the `id`', async () => {
      expect(controller.findById('id')).resolves.toEqual({
        ...rooms[1],
        id: 'id',
      });
    });

    it('should throw an error if room is not found', async () => {
      jest
        .spyOn(service, 'findByIdOrThrow')
        .mockRejectedValue(new NotFoundException('error'));

      expect(controller.findById('id')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new room with an id', async () => {
      const room = await controller.create({
        name: 'room 5',
        floorId: '1',
        roomTypeId: '1',
        tenantOccupancyLimit: 5,
      });
      expect(room).toHaveProperty('id');
    });

    it('should throw an error if an existing room name exists', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(
          new BadRequestException(
            'room name already exist. Please try another one.',
          ),
        );

      expect(
        controller.create({
          name: 'two',
          floorId: '1',
          roomTypeId: '1',
          tenantOccupancyLimit: 3,
        }),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update the room', async () => {
      const room = await controller.update('test-id', {
        status: Status.INACTIVE,
      });
      expect(room).toHaveProperty('id');
      expect(room?.id).toBe('test-id');
    });

    it('should throw an error if room is not found', async () => {
      jest
        .spyOn(service, 'updateById')
        .mockRejectedValue(new NotFoundException('Room Not Found.'));

      expect(
        controller.update('id does not exist', { name: 'new name' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should return the deleted room base on the id', async () => {
      const room = await controller.delete('test-id-delete');
      expect(room).toHaveProperty('id');
      expect(room?.id).toBe('test-id-delete');
    });

    it('should throw an error if an existing room name exists', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new NotFoundException('Room Not Found'));

      expect(controller.delete('none existing id')).rejects.toThrowError(
        /Room Not Found/,
      );
    });
  });
});
