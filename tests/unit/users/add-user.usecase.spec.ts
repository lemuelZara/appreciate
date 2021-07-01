import { AddUserUseCase } from '~modules/users/usecases/add-user/add-user.usecase';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';
import { User } from '~modules/users/entities';
import { AddUserDTO } from '~modules/users/dtos';

import { BadRequestException } from '~shared/errors/http-errors';
import { CryptoProtocols } from '~shared/container/providers/crypto/protocols';
import { BCryptProvider } from '~shared/container/providers/crypto/bcrypt';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeUserData = (): AddUserDTO => ({
  name: 'valid_name',
  email: 'valid_email',
  admin: true,
  password: 'valid_password'
});

const makeFakeUser = (): User => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  admin: true,
  password: 'valid_password',
  createdAt,
  updatedAt
});

describe('AddUserUseCase', () => {
  let usecase: AddUserUseCase;
  let repository: UserRepositoryProtocols;
  let provider: CryptoProtocols;

  beforeEach(async () => {
    repository = new UserRepository();
    provider = new BCryptProvider(12);
    usecase = new AddUserUseCase(repository, provider);

    provider.hash = jest.fn();

    repository.add = jest.fn();
    repository.findByEmail = jest.fn();
  });

  test('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  test('should be throw if email not provided', async () => {
    const userData = makeFakeUserData();

    userData.email = '';

    await expect(usecase.execute(userData)).rejects.toEqual(
      new BadRequestException('Email is not provided!')
    );
  });

  test('should be called findByEmail with correct params', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);

    await usecase.execute(makeFakeUserData());

    expect(repository.findByEmail).toHaveBeenCalledWith('valid_email');
  });

  test('should be throw if findByEmail returns existent user', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(makeFakeUser());

    await expect(usecase.execute(makeFakeUserData())).rejects.toEqual(
      new BadRequestException('User already exists!')
    );
  });

  test('should be called hash with correct params', async () => {
    const hasherSpy = jest.spyOn(provider, 'hash');

    await usecase.execute(makeFakeUserData());

    expect(hasherSpy).toHaveBeenCalledWith('valid_password');
  });

  test('should be called add with correct params', async () => {
    jest.spyOn(provider, 'hash').mockResolvedValueOnce('hashed_password');
    jest.spyOn(repository, 'add').mockResolvedValue(makeFakeUser());

    await usecase.execute(makeFakeUserData());

    expect(repository.add).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      admin: true,
      password: 'hashed_password'
    });
  });

  test('should be return created user', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(repository, 'add').mockResolvedValue(makeFakeUser());

    const createdUser = await usecase.execute(makeFakeUserData());

    expect(createdUser).toEqual(makeFakeUser());
  });
});
