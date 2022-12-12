import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../db/prisma.service';
import { RoomTypeController } from './room-type.controller';
import { RoomTypeService } from './room-type.service';

describe('RoomTypeController', () => {
  let controller: RoomTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomTypeController],
      providers: [
        {
          provide: RoomTypeService,
          useValue: [],
        },
        {
          provide: PrismaService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<RoomTypeController>(RoomTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
