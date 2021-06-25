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
  });
});
