import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../db/prisma.service';
import { RoomTypeService } from './room-type.service';

describe('RoomTypeService', () => {
  let service: RoomTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomTypeService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RoomTypeService>(RoomTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
