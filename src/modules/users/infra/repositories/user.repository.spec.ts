import { UserRepository } from './user.repository';

import { User } from '~modules/users/entities';

import { prisma } from '~shared/infra/database/prisma/client';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockData: User;

  beforeEach(() => {
    repository = new UserRepository();

    prisma.user.create = jest.fn();
    prisma.user.findFirst = jest.fn();

    mockData = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      admin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  test('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('add', () => {
    test('should be called create with correct params', async () => {
      jest.spyOn(prisma.user, 'create').mockResolvedValue({} as User);

      await repository.add({
        name: 'any_name',
        email: 'any_email',
        admin: true
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { name: 'any_name', email: 'any_email', admin: true }
      });
    });

    test('should be throw when create throws', async () => {
      jest.spyOn(prisma.user, 'create').mockRejectedValue(new Error());

      const promise = repository.add(mockData);

      expect(promise).rejects.toThrow(new Error());
    });

    test('should be successfully return user created', async () => {
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockData);

      expect(
        await repository.add({
          name: 'any_name',
          email: 'any_email',
          admin: true
        })
      ).toEqual(mockData);
    });
  });
});
