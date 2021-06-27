import { TagRepository } from './tag.repository';

import { Tag } from '~modules/tags/entities';

import { prisma } from '~shared/infra/database/prisma/client';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeTag = (): Tag => ({
  id: 'any_id',
  name: 'any_name',
  createdAt,
  updatedAt
});

const makeFakeFindAllTags = (): Tag[] => [
  {
    id: 'any_id',
    name: 'any_name',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

describe('TagRepository', () => {
  let repository: TagRepository;

  beforeEach(() => {
    repository = new TagRepository();

    prisma.user.create = jest.fn();
    prisma.user.findMany = jest.fn();
  });

  test('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('add', () => {
    test('should be called create with correct params', async () => {
      jest.spyOn(prisma.tag, 'create').mockResolvedValue({} as Tag);

      await repository.add({ name: 'any_name' });

      expect(prisma.tag.create).toHaveBeenCalledWith({
        data: { name: 'any_name' }
      });
    });

    test('should be throw when create throws', async () => {
      jest.spyOn(prisma.tag, 'create').mockRejectedValue(new Error());

      const promise = repository.add(makeFakeTag());

      expect(promise).rejects.toThrow(new Error());
    });

    test('should be successfully return tag created', async () => {
      jest.spyOn(prisma.tag, 'create').mockResolvedValue(makeFakeTag());

      expect(await repository.add({ name: 'any_name' })).toEqual(makeFakeTag());
    });
  });

  describe('findByName', () => {
    test('should be called findFirst with correct params', async () => {
      jest.spyOn(prisma.tag, 'findFirst').mockResolvedValue({} as Tag);

      await repository.findByName('any_name');

      expect(prisma.tag.findFirst).toHaveBeenCalledWith({
        where: { name: 'any_name' }
      });
    });

    test('should be throw when findFirst throws', async () => {
      jest.spyOn(prisma.tag, 'findFirst').mockRejectedValue(new Error());

      const promise = repository.findByName('any_name');

      expect(promise).rejects.toThrow(new Error());
    });

    test('should be successfully return the found tag', async () => {
      jest.spyOn(prisma.tag, 'findFirst').mockResolvedValue(makeFakeTag());

      expect(await repository.findByName('any_name')).toEqual(makeFakeTag());
    });
  });

  describe('findAll', () => {
    test('should be throw when findAll throws', async () => {
      jest.spyOn(prisma.tag, 'findMany').mockRejectedValue(new Error());

      const promise = repository.findAll();

      expect(promise).rejects.toThrow(new Error());
    });

    test('should be successfully return all tags', async () => {
      jest
        .spyOn(prisma.tag, 'findMany')
        .mockResolvedValue(makeFakeFindAllTags());

      expect(await repository.findAll()).toEqual(makeFakeFindAllTags());
    });
  });
});
