import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from './../db/prisma.service';
import { User } from '@prisma/client';
import * as uuid from 'uuid';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const users: User[] = [
    {
      firstName: 'Mark',
      lastName: 'Abeto',
      email: 'test@gmail.com',
      userName: 'marko_polo',
      status: 'ACTIVE',
      type: 'TENANT',
      password: '$2a$10$QI7jiGrY/SCwbgRIGww/BuNOru32XaJwOAN7u4xMrUHivDvUsAMEC', // test-password123
      avatarUrl: null,
      roomId: null,
      dateOfBirth: new Date('2000-05-19'),
      id: '5903b7ad-79ba-4adf-b334-801d1dc50012',
      createdAt: new Date(),
      updatedAt: new Date(),
      middleName: null,
    },
    {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'dela_cruz@gmail.com',
      userName: 'juan_dela_cruz',
      status: 'ACTIVE',
      type: 'TENANT',
      password: '$2a$10$QI7jiGrY/SCwbgRIGww/BuNOru32XaJwOAN7u4xMrUHivDvUsAMEC', // test-password123
      avatarUrl: null,
      roomId: null,
      dateOfBirth: new Date('2000-05-19'),
      id: '5903b7ad-79ba-4adf-b334-801d1dc50015',
      createdAt: new Date(),
      updatedAt: new Date(),
      middleName: null,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockImplementation(async (data) => {
                return {
                  ...data,
                  id: uuid.v4(),
                };
              }),
              update: jest.fn().mockResolvedValue(users[1]),
              delete: jest.fn(),
              findUnique: jest.fn().mockImplementation(async ({ where }) => {
                const keys = Object.keys(where);

                if (!keys.length) return null;

                return (
                  users.find((value) => {
                    for (const key of keys) {
                      if (where[key] !== value[key]) return false;
                    }

                    return true;
                  }) || null
                );
              }),
              findMany: jest.fn().mockResolvedValue(users),
              count: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should return an array of users', async () => {
      await expect(service.findMany()).resolves.toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return `null` if user is not found', async () => {
      await expect(service.findById('')).resolves.toBeNull();
    });

    it('should return the first use base on the email', async () => {
      await expect(service.findByEmail('test@gmail.com')).resolves.toEqual(
        users[0],
      );
    });

    it('should return the first use base on the id', async () => {
      await expect(
        service.findById('5903b7ad-79ba-4adf-b334-801d1dc50012'),
      ).resolves.toEqual(users[0]);
    });

    it('should return the first use base on the userName', async () => {
      await expect(service.findByUsername('juan_dela_cruz')).resolves.toEqual(
        users[1],
      );
    });
  });

  describe('findByEmail', () => {
    it('should return the first use base on the email', async () => {
      await expect(service.findByEmail('test@gmail.com')).resolves.toEqual(
        users[0],
      );
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      await expect(
        service.create({
          firstName: 'George',
          lastName: 'Clowney',
          email: 'george@clowney.com',
          userName: 'clowney_george',
          status: 'ACTIVE',
          type: 'TENANT',
          password: 'test-password123',
          dateOfBirth: new Date('1990-05-29'),
          roomId: 'test',
          middleName: null,
        }),
      ).resolves.toHaveProperty('id');
    });
  });

  describe('updateById', () => {
    it('should update the details of a user', async () => {
      await expect(
        service.updateById('5903b7ad-79ba-4adf-b334-801d1dc50015', {
          firstName: 'test',
        }),
      ).resolves.toEqual(users[1]);
    });
  });

  describe('deleteById', () => {
    it('should return the details of the deleted user', async () => {
      jest.spyOn(prismaService.user, 'delete').mockResolvedValueOnce(users[0]);

      await expect(
        service.deleteById('5903b7ad-79ba-4adf-b334-801d1dc50012'),
      ).resolves.toEqual(users[0]);
    });
  });

  describe('updateUserStatus', () => {
    it('should return the details of the updated user', async () => {
      jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(users[0]);

      await expect(
        service.updateUserType('5903b7ad-79ba-4adf-b334-801d1dc50012', 'ADMIN'),
      ).resolves.toEqual(users[0]);
    });
  });
});
