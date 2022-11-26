import { Test, TestingModule } from '@nestjs/testing';
import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';
import { Floor, Status } from '@prisma/client';
import * as uuid from 'uuid';

describe('FloorController', () => {
  let controller: FloorController;
  let service: FloorService;

  const secondFloor: Floor = {
    id: '0760c29b-8b2a-47fd-a67c-7f8ae2ef6fd0',
    name: '2nd',
    status: Status.INACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const floors: Floor[] = [
    {
      id: '0f533024-d8b3-4dd2-9e56-d75231025c5e',
      name: '1st',
      status: Status.INACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    secondFloor,
    {
      id: '9e395b75-3ec0-490d-b749-e404311cbe0c',
      name: '3rd',
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloorController],
      providers: [
        {
          provide: FloorService,
          useValue: {
            findMany: jest.fn().mockResolvedValue(floors),
            findOne: jest.fn(),
            findByIdOrThrow: jest.fn().mockResolvedValue(secondFloor),
            findById: jest.fn(),
            create: jest.fn().mockImplementation(async (args) => {
              return {
                ...args.data,
                id: uuid.v4(),
              };
            }),
            updateStatusById: jest
              .fn()
              .mockImplementation(async (id, status) => {
                return {
                  ...floors[1],
                  status,
                  id,
                };
              }),
            delete: jest.fn().mockResolvedValue(secondFloor),
            updateById: jest.fn().mockImplementation(async (id, data) => {
              return {
                ...floors[1],
                ...data,
                id,
              };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<FloorController>(FloorController);
    service = module.get<FloorService>(FloorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMany', () => {
    it('should return all floors', async () => {
      await expect(controller.findMany()).resolves.toEqual(floors);
    });

    it('should return all floors', async () => {
      jest.spyOn(controller, 'findMany').mockResolvedValue([]);
      await expect(controller.findMany()).resolves.toEqual([]);
    });
  });

  describe('findById', () => {
    it('should call the `findByIdOrThrow` method', async () => {
      await controller.findById('id');
      expect(service.findByIdOrThrow).toBeCalled();
    });

    it('should retrieve the floor details base on the id', async () => {
      await expect(controller.findById('id')).resolves.toEqual(secondFloor);
    });

    it('should throw an error if the floor is not found', async () => {
      jest
        .spyOn(service, 'findByIdOrThrow')
        .mockRejectedValueOnce(new Error('Floor not Found'));

      await expect(controller.findById('id')).rejects.toThrowError(
        /Floor not Found/,
      );
    });
  });

  describe('create', () => {
    it('should return the newly created floor with the id', async () => {
      await expect(
        controller.create({
          name: '4th',
          status: Status.INACTIVE,
        }),
      ).resolves.toHaveProperty('id');
    });
  });

  describe('updatedById', () => {
    it('should return the newly created floor with the id', async () => {
      await expect(
        controller.updateById('id', { name: 'second' }),
      ).resolves.toHaveProperty('name', 'second');
    });
  });

  describe('updateStatusById', () => {
    it('should return the floor with the updated status', async () => {
      await expect(
        controller.updateStatus('id', Status.ACTIVE),
      ).resolves.toHaveProperty('status', Status.ACTIVE);
    });
  });

  describe('delete', () => {
    it('should return the floor details after deletion', async () => {
      await expect(controller.deleteById('id')).resolves.toEqual(secondFloor);
    });

    it('should throw an error if floor is not found', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValueOnce(new Error('Floor not found.'));

      await expect(controller.deleteById('id')).rejects.toThrowError(Error);
    });

    it('should throw an error if floor has existing rooms', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValueOnce(new Error('floor has existing rooms.'));

      await expect(controller.deleteById('id')).rejects.toThrowError(
        /floor has existing rooms/,
      );
    });
  });
});
