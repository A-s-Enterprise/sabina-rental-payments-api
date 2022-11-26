import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import {
  getRedisToken,
  DEFAULT_REDIS_NAMESPACE,
} from '@liaoliaots/nestjs-redis';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNmZDFmZTkxLWFjNWUtNDA3ZC05MWFlLWZkYzZlMzJhN2NjMCIsInVzZXJOYW1lIjoibWFjMjFtYWNreSIsImV4cCI6MTY5OTg2MjcyOH0.xID5OR4NbE5wHwVbv-eR7EIq20m40wDDyXkWusaQWdY';

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
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByUsernameOrThrow: jest
              .fn()
              .mockImplementation(async (userName) => {
                const user = users.find((user) => user.userName === userName);

                if (!user) {
                  throw new BadRequestException('user does not exist.');
                }
                return user;
              }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockReturnValue(token),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRedisToken(DEFAULT_REDIS_NAMESPACE),
          useValue: {
            setex: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if `username` or `password` parameters are not provided.', async () => {
    await expect(
      service.login({ userName: 'marko_polo' } as any),
    ).rejects.toThrowError(Error);

    await expect(
      service.login({ password: 'test' } as any),
    ).rejects.toThrowError(Error);
  });

  it('should throw if the `userName` does not exists', async () => {
    await expect(
      service.login({
        userName: 'test',
        password: 'aa',
      }),
    ).rejects.toThrowError('user does not exist.');
  });

  it('should throw if the password provided is incorrect.', async () => {
    await expect(
      service.login({
        userName: 'marko_polo',
        password: 'test-password12',
      }),
    ).rejects.toThrow('password provided is incorrect.');
  });

  it('should return the valid token', async () => {
    await expect(
      service.login({
        userName: 'marko_polo',
        password: 'test-password123',
      }),
    ).resolves.toHaveProperty('access_token');
  });
});
