import { TagRepository } from './tag.repository';

import { Tag } from '~modules/tags/entities';

import { prisma } from '~shared/infra/database/prisma/client';

describe('TagRepository', () => {
  let repository: TagRepository;
  let mockData: Tag;

  beforeEach(() => {
    repository = new TagRepository();

    prisma.user.create = jest.fn();

    mockData = {
      id: 'any_id',
      name: 'any_name',
      createdAt: new Date(),
      updatedAt: new Date()
    };
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

      const promise = repository.add(mockData);

      expect(promise).rejects.toThrow(new Error());
    });

    test('should be successfully return tag created', async () => {
      jest.spyOn(prisma.tag, 'create').mockResolvedValue(mockData);

      expect(await repository.add({ name: 'any_name' })).toEqual(mockData);
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
  });
});
