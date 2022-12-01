import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from './../db/prisma.service';
import { Status, UserType } from '@prisma/client';
import { Type } from 'class-transformer';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let user1, user2, user3, user4, user5;
  let room, room2;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    const floor = await prisma.floor.create({
      data: {
        name: '1st',
        status: Status.ACTIVE,
      },
    });

    const roomType = await prisma.roomType.create({
      data: {
        name: 'double deck',
        amount: 2000,
      },
    });

    room = await prisma.room.create({
      data: {
        name: '1',
        tenantOccupancyLimit: 5,
        floorId: floor.id,
        roomTypeId: roomType.id,
      },
    });

    room2 = await prisma.room.create({
      data: {
        name: '2',
        tenantOccupancyLimit: 5,
        floorId: floor.id,
        roomTypeId: roomType.id,
      },
    });

    [user1, user2, user3, user4, user5] = await Promise.all([
      service.create({
        firstName: 'Mark',
        lastName: 'Abeto',
        email: 'test@gmail.com',
        userName: 'marko_polo',
        status: Status.ACTIVE,
        type: UserType.TENANT,
        password:
          '$2a$10$QI7jiGrY/SCwbgRIGww/BuNOru32XaJwOAN7u4xMrUHivDvUsAMEC', // test-password123
        dateOfBirth: new Date('2000-05-19'),
        roomId: room.id,
        middleName: null,
      }),
      service.create({
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        email: 'dela_cruz@gmail.com',
        userName: 'juan_dela_cruz',
        status: Status.INACTIVE,
        type: UserType.TENANT,
        password:
          '$2a$10$QI7jiGrY/SCwbgRIGww/BuNOru32XaJwOAN7u4xMrUHivDvUsAMEC', // test-password123
        avatarUrl: null,
        roomId: room.id,
        dateOfBirth: new Date('1993-05-26'),
        middleName: null,
      }),
      service.create({
        firstName: 'Test',
        lastName: 'Dela Cruz',
        email: 'test_dela_cruz@gmail.com',
        userName: 'juan_dela_test_cruz',
        status: Status.INACTIVE,
        type: UserType.TENANT,
        password:
          '$2a$10$QI7jiGrY/SCwbgRIGww/BuNOru32XaJwOAN7u4xMrUHivDvUsAMEC', // test-password123
        avatarUrl: null,
        roomId: room.id,
        dateOfBirth: new Date('1990-03-20'),
        middleName: null,
      }),
      service.create({
        firstName: 'John',
        lastName: 'Jones',
        email: 'john@jones.com',
        userName: 'john_jones',
        status: Status.INACTIVE,
        type: UserType.TENANT,
        password:
          '$2a$10$QI7jiGrY/SCwbgRIGww/BuNOru32XaJwOAN7u4xMrUHivDvUsAMEC', // test-password123
        avatarUrl: null,
        roomId: room.id,
        dateOfBirth: new Date('1985-11-27'),
        middleName: null,
      }),
      service.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@doe.com',
        userName: 'jane_doe123',
        status: Status.INACTIVE,
        type: UserType.TENANT,
        password:
          '$2a$10$QI7jiGrY/SCwbgRIGww/BuNOru32XaJwOAN7u4xMrUHivDvUsAMEC', // test-password123
        avatarUrl: null,
        roomId: room2.id,
        dateOfBirth: new Date('1990-02-20'),
        middleName: null,
      }),
    ]);
  });

  it('should return the number of users', async () => {
    await expect(service.findMany()).resolves.toHaveLength(5);
  });

  it('should return the `ACTIVE` users', async () => {
    await expect(
      service.findMany({ where: { status: Status.ACTIVE } }),
    ).resolves.toHaveLength(1);
  });

  it('should return the `INACTIVE` number of users', async () => {
    await expect(
      service.findMany({ where: { status: Status.INACTIVE } }),
    ).resolves.toHaveLength(4);
  });

  it('should throw an error when finding a user is not found.', async () => {
    await expect(service.findByIdOrThrow('id')).rejects.toThrowError();
  });

  it('should return the details of the user base on the id', async () => {
    await expect(service.findByIdOrThrow(user1.id)).resolves.toHaveProperty(
      'id',
      user1.id,
    );
  });

  it('should return null if user is not found', async () => {
    await expect(service.findById('id')).resolves.toBeNull();
  });

  it('should the details of the user base on the id', async () => {
    await expect(service.findById(user2.id)).resolves.toHaveProperty(
      'email',
      'dela_cruz@gmail.com',
    );
  });

  it('should throw an error if `email` already exist when creating a user with the existing email', async () => {
    await expect(
      service.create({
        userName: 'jane_doe1234',
        dateOfBirth: new Date('2001-05-01'),
        email: 'jane@doe.com',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'test123',
        roomId: room2.id,
        status: Status.INACTIVE,
      }),
    ).rejects.toThrowError();
  });

  it('should throw an error if `username` already exist when creating a user with the existing username', async () => {
    await expect(
      service.create({
        userName: 'jane_doe123',
        dateOfBirth: new Date('2001-05-01'),
        email: 'jane@doe2.com',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'test123',
        roomId: room2.id,
        status: Status.INACTIVE,
      }),
    ).rejects.toThrowError();
  });

  it('should return the details of the new user', async () => {
    await expect(
      service.create({
        userName: 'miss_jane_doe',
        dateOfBirth: new Date('2001-05-01'),
        email: 'jane@doe2.com',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'test123',
        roomId: room2.id,
        status: Status.INACTIVE,
      }),
    ).resolves.toHaveProperty('type', UserType.TENANT);
  });

  it('should return the update number of users', async () => {
    await expect(service.findMany()).resolves.toHaveLength(6);
  });

  it('should throw an error if `email` already exist when creating a user with the existing email', async () => {
    await expect(
      service.updateById(user2.id, {
        email: 'test_dela_cruz@gmail.com',
      }),
    ).rejects.toThrowError();
  });

  it('should throw an error if `username` already exist when creating a user with the existing username', async () => {
    await expect(
      service.updateById(user3.id, {
        userName: 'juan_dela_cruz',
      }),
    ).rejects.toThrowError();
  });

  it('should throw an error if `username` already exist when creating a user with the existing username', async () => {
    await expect(
      service.updateById(user3.id, {
        userName: 'juan_dela_cruz',
      }),
    ).rejects.toThrowError();
  });

  it('should update the `status` of the user', async () => {
    await expect(
      service.updateById(user4.id, {
        status: Status.ACTIVE,
      }),
    ).resolves.toHaveProperty('status', Status.ACTIVE);
  });

  it('should update the `email` of the user', async () => {
    await expect(
      service.updateById(user5.id, {
        email: 'jane_doe_doe@gmail.com',
      }),
    ).resolves.not.toHaveProperty('email', 'jane_doe@gmail.com');
  });

  it('should throw an error when removing a user that does not exist', async () => {
    await expect(service.deleteById('id')).rejects.toThrowError();
  });

  it('should return the details of the user when removing', async () => {
    await expect(service.deleteById(user2.id)).resolves.not.toBeNull();
  });

  it('should return the update number of users', async () => {
    await expect(service.findMany()).resolves.toHaveLength(5);
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
