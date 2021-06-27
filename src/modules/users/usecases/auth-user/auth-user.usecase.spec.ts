import { AuthUserUseCase } from './auth-user.usecase';

import { User } from '~modules/users/entities';
import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';
import { AuthUserDTO } from '~modules/users/dtos';

import { CryptoProtocols } from '~shared/container/providers/crypto/protocols';
import { BCryptProvider } from '~shared/container/providers/crypto/bcrypt';
import { JsonWebTokenProvider } from '~shared/container/providers/jwt/impl/json-web-token.provider';
import { JWTProtocols } from '~shared/container/providers/jwt/protocols';
import { BadRequestException } from '~shared/errors/http-errors';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeAuthData = (): AuthUserDTO => ({
  email: 'any_email',
  password: 'any_password'
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

describe('AuthUserUseCase', () => {
  let usecase: AuthUserUseCase;
  let repository: UserRepositoryProtocols;
  let cryptoProvider: CryptoProtocols;
  let jwtProvider: JWTProtocols;

  beforeEach(() => {
    repository = new UserRepository();
    cryptoProvider = new BCryptProvider(12);
    jwtProvider = new JsonWebTokenProvider();
    usecase = new AuthUserUseCase(repository, cryptoProvider, jwtProvider);

    repository.findByEmail = jest.fn();

    cryptoProvider.compare = jest.fn();
    jwtProvider.generateToken = jest.fn();
  });

  test('should be definied', () => {
    expect(usecase).toBeDefined();
  });

  test('should be called findByEmail with correct params', async () => {
    jest.spyOn(cryptoProvider, 'compare').mockResolvedValueOnce(true);
    jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(makeFakeUser());

    await usecase.execute(makeFakeAuthData());

    expect(repository.findByEmail).toHaveBeenCalledWith('any_email');
  });

  test('should be throw if findByEmail not return existent user', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(null);

    const promise = usecase.execute(makeFakeAuthData());

    await expect(promise).rejects.toEqual(
      new BadRequestException('Incorrect credentials, try again.')
    );
  });

  test('should be called compare with correct params', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(makeFakeUser());
    jest.spyOn(cryptoProvider, 'compare').mockResolvedValueOnce(true);

    await usecase.execute(makeFakeAuthData());

    expect(cryptoProvider.compare).toHaveBeenCalledWith(
      'any_password',
      'valid_password'
    );
  });

  test('should be throw if compare returns false', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(makeFakeUser());
    jest.spyOn(cryptoProvider, 'compare').mockResolvedValueOnce(false);

    const promise = usecase.execute(makeFakeAuthData());

    await expect(promise).rejects.toEqual(
      new BadRequestException('Incorrect credentials, try again.')
    );
  });

  test('should be return a token on success', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(makeFakeUser());
    jest.spyOn(cryptoProvider, 'compare').mockResolvedValueOnce(true);
    jest.spyOn(jwtProvider, 'generateToken').mockReturnValueOnce('any_token');

    const response = await usecase.execute(makeFakeAuthData());

    expect(response).toHaveProperty('token');
    expect(response.token).toBe('any_token');
  });
});
