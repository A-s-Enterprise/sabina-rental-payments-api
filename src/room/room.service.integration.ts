import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Status, UserType } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { RoomService } from './room.service';
import { IsFloorIdExistConstraint } from './validators/IsFloorIdExist';
import { IsFloorLimitReachedConstraint } from './validators/IsFloorLimitReached';
import { IsRoomTypeIdExistConstraint } from './validators/IsRoomTypeIdExist';

describe('RoomService integration', () => {
  let roomService: RoomService;
  let prisma: PrismaService;
  let room1, room2, room3;
  let floor, roomType;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RoomService,
        PrismaService,
        IsFloorIdExistConstraint,
        IsRoomTypeIdExistConstraint,
        IsFloorLimitReachedConstraint,
      ],
    }).compile();

    roomService = module.get<RoomService>(RoomService);
    prisma = module.get<PrismaService>(PrismaService);

    floor = await prisma.floor.create({
      data: {
        name: '1st',
        status: Status.ACTIVE,
      },
    });

    roomType = await prisma.roomType.create({
      data: {
        name: 'double deck',
        amount: 2000,
      },
    });

    [room1, room2, room3] = await Promise.all([
      roomService.create({
        floorId: floor.id,
        name: 'one',
        roomTypeId: roomType.id,
        status: Status.INACTIVE,
        tenantOccupancyLimit: 2,
      }),
      roomService.create({
        floorId: floor.id,
        name: 'two',
        roomTypeId: roomType.id,
        status: Status.ACTIVE,
        tenantOccupancyLimit: 5,
      }),
      roomService.create({
        floorId: floor.id,
        name: 'three',
        roomTypeId: roomType.id,
        status: Status.ACTIVE,
        tenantOccupancyLimit: 2,
      }),
    ]);

    await prisma.user.create({
      data: {
        firstName: 'Mark',
        lastName: 'Abeto',
        email: 'test@gmail.com',
        userName: 'marko_polo',
        status: Status.ACTIVE,
        type: UserType.TENANT,
        password:
          '$2a$10$QI7jiGrY/SCwbgRIGww/BuNOru32XaJwOAN7u4xMrUHivDvUsAMEC', // test-password123
        dateOfBirth: new Date('2000-05-19'),
        roomId: room1.id,
        middleName: null,
      },
    });

    // const app = module.createNestApplication();
    // app.useGlobalPipes(new ValidationPipe({ transform: true }));
    // await app.init();
  });

  it('should retrieve all the rooms', async () => {
    const rooms = await roomService.findMany();
    expect(rooms).toHaveLength(3);
  });

  it("should return `null` when finding a room that doesn't exist", async () => {
    await expect(roomService.findById('error id')).resolves.toBeNull();
  });

  it('should return the details of the specific `room`', async () => {
    await expect(roomService.findById(room1.id)).resolves.toEqual(room1);
  });

  it("should throw an error when finding a room that doesn't exist", async () => {
    await expect(
      roomService.findByIdOrThrow('error id'),
    ).rejects.toThrowError();
  });

  it('should return the details of the specific `room`', async () => {
    await expect(roomService.findByIdOrThrow(room3.id)).resolves.toEqual(room3);
  });

  it('should throw an error when creating a room with a name that already exists', async () => {
    await expect(
      roomService.create({
        floorId: floor.id,
        name: 'one',
        roomTypeId: roomType.id,
        tenantOccupancyLimit: 2,
      }),
    ).rejects.toThrowError();
  });

  it('should create a new room', async () => {
    await expect(
      roomService.create({
        floorId: floor.id,
        name: 'four',
        roomTypeId: roomType.id,
        tenantOccupancyLimit: 2,
      }),
    ).resolves.not.toBeNull();
  });

  it('should throw an error when updating a room with a name that already exists', async () => {
    await expect(
      roomService.updateById(room3.id, { name: 'two' }),
    ).rejects.toThrowError();
  });

  it('should update the room', async () => {
    await expect(
      roomService.updateById(room2.id, { status: Status.INACTIVE }),
    ).resolves.toHaveProperty('status', Status.INACTIVE);
  });

  it('should throw an error when deleting a room with an existing user', async () => {
    await expect(roomService.delete(room1.id)).rejects.toThrowError();
  });

  it('should return the details of the room after deleting', async () => {
    await expect(roomService.delete(room3.id)).resolves.toEqual(room3);
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.room.deleteMany(),
      prisma.roomType.deleteMany(),
      prisma.floor.deleteMany(),
    ]);
    await prisma.$disconnect();
  });
});
