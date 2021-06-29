import { ListUsersUseCase } from './list-users.usecase';

import { User } from '~modules/users/entities';
import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeAllUsers = (): User[] => [
  {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    admin: true,
    password: 'any_password',
    createdAt,
    updatedAt
  }
];

describe('ListTagsUseCase', () => {
  let usecase: ListUsersUseCase;
  let repository: UserRepositoryProtocols;

  beforeEach(() => {
    repository = new UserRepository();
    usecase = new ListUsersUseCase(repository);

    repository.findAll = jest.fn();
  });

  test('should be return success tags data', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValueOnce(makeFakeAllUsers());

    const users = await usecase.execute();

    expect(users).toEqual(makeFakeAllUsers());
  });
});
