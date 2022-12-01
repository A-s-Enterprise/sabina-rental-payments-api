import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../db/prisma.service';
import { FloorService } from './floor.service';
import { Floor, Status, Prisma } from '@prisma/client';
import * as uuid from 'uuid';
import { NotFoundError } from '@prisma/client/runtime';

describe('FloorService', () => {
  let service: FloorService;
  let prisma: PrismaService;
  let one, two, three;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FloorService, PrismaService],
    }).compile();

    service = module.get<FloorService>(FloorService);
    prisma = module.get<PrismaService>(PrismaService);

    [one, two, three] = await Promise.all([
      service.create({
        name: 'first',
        status: Status.ACTIVE,
      }),
      service.create({
        name: 'second',
        status: Status.INACTIVE,
      }),
      service.create({
        name: 'third',
        status: Status.ACTIVE,
      }),
    ]);
  });

  it('should return the right number of floors', async () => {
    await expect(prisma.floor.count()).resolves.toBe(3);
  });

  it('should return an array of floors', async () => {
    await expect(service.findMany()).resolves.toHaveLength(3);
  });

  it('should return a new floor with a name of 1st', async () => {
    await expect(
      service.findOne({ where: { name: 'first' } }),
    ).resolves.toHaveProperty('name', 'first');
  });

  it('should return the newly created floor', async () => {
    const floor = await service.create({
      name: 'fourth',
      status: Status.INACTIVE,
    });

    expect(floor).toHaveProperty('id');
    expect(floor).toHaveProperty('createdAt');
    expect(floor).toHaveProperty('updatedAt');
  });

  it('should return the updated number of floors', async () => {
    await expect(prisma.floor.count()).resolves.toBe(4);
  });

  it('should return an array of floors', async () => {
    await expect(service.findMany()).resolves.toHaveLength(4);
  });

  it('should the number of `ACTIVE` floors', async () => {
    await expect(
      prisma.floor.count({
        where: {
          status: Status.ACTIVE,
        },
      }),
    ).resolves.toBe(2);
  });

  it('should the number of `INACTIVE` floors', async () => {
    await expect(
      prisma.floor.count({
        where: {
          status: Status.INACTIVE,
        },
      }),
    ).resolves.toBe(2);
  });

  it('should throw an error if `floor` was not found', async () => {
    await expect(service.findByIdOrThrow('id')).rejects.toThrowError();
  });

  it('should return `null` if `floor` was not found', async () => {
    await expect(service.findById('id')).resolves.toBeNull();
  });

  it('should return the details of the floor using the id ', async () => {
    await expect(service.findById(one.id)).resolves.toEqual(one);
  });

  it('should update the `name` of the floor', async () => {
    await expect(
      service.updateById(one.id, { name: '1st' }),
    ).resolves.toHaveProperty('name', '1st');
  });

  it('should throw an error when updating a floor that does not exist', async () => {
    await expect(
      service.updateById('sample id', { name: '1st' }),
    ).rejects.toThrowError();
  });

  it('should update the `status` of the floor', async () => {
    await expect(
      service.updateStatusById(two.id, Status.ACTIVE),
    ).resolves.toHaveProperty('status', Status.ACTIVE);
  });

  it('should the number of `ACTIVE` floors', async () => {
    await expect(
      prisma.floor.count({
        where: {
          status: Status.ACTIVE,
        },
      }),
    ).resolves.toBe(3);
  });

  it('should throw an error if deleting a `floor` that does not exist', async () => {
    await expect(service.delete('id')).rejects.toThrowError(NotFoundError);
  });

  it('should return the floor details after deletion', async () => {
    await expect(service.delete(three.id)).resolves.toEqual(three);
  });

  afterAll(async () => {
    await prisma.$transaction([prisma.floor.deleteMany()]);
    await prisma.$disconnect();
  });
});
