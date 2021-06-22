import { AddUserUseCase } from './add-user.usecase';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';
import { User } from '~modules/users/entities';
import { AddUserDTO } from '~modules/users/dtos';

import { AppError } from '~shared/errors';

const makeFakeUserData = (): AddUserDTO => ({
  name: 'valid_name',
  email: 'valid_email',
  admin: true
});

const makeFakeUser = (): User => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  admin: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

describe('AddUserUseCase', () => {
  let usecase: AddUserUseCase;
  let repository: UserRepositoryProtocols;

  beforeEach(async () => {
    repository = new UserRepository();
    usecase = new AddUserUseCase(repository);

    repository.add = jest.fn();
    repository.findByEmail = jest.fn();
  });

  test('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  test('should be throw if email not provided', async () => {
    const userData = makeFakeUserData();

    userData.email = '';

    await expect(usecase.execute(userData)).rejects.toBeInstanceOf(AppError);
  });

  test('should be called findByEmail with correct params', async () => {
    const userData = makeFakeUserData();

    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);

    await usecase.execute(userData);

    expect(repository.findByEmail).toBeCalledWith('valid_email');
  });

  test('should be throw if findByEmail returns existent user', async () => {
    const userData = makeFakeUserData();

    jest.spyOn(repository, 'findByEmail').mockResolvedValue(makeFakeUser());

    await expect(usecase.execute(userData)).rejects.toBeInstanceOf(AppError);
  });

  test('should be return created user', async () => {
    const fakeUser = makeFakeUser();

    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(repository, 'add').mockResolvedValue(fakeUser);

    const createdUser = await usecase.execute({
      name: 'valid_name',
      email: 'valid_email',
      admin: true
    });

    expect(createdUser).toEqual(fakeUser);
  });
});
