import { Request } from 'express';

import { EnsureAdminMiddleware } from './ensure-admin.middleware';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';
import { User } from '~modules/users/entities';

import { BadRequestException } from '~shared/errors/http-errors';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeUser = (): User => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  admin: true,
  password: 'valid_password',
  createdAt,
  updatedAt
});

describe('EnsureAdmindMiddleware', () => {
  let middleware: EnsureAdminMiddleware;
  let repository: UserRepositoryProtocols;

  const makeFakeHttpRequest = () =>
    ({
      user: {
        id: 'any_id'
      }
    } as Request);

  const httpResponse = {
    status: jest.fn(() => httpResponse),
    json: jest.fn()
  };

  const next = jest.fn();

  beforeEach(() => {
    repository = new UserRepository();
    middleware = new EnsureAdminMiddleware(repository);

    repository.findById = jest.fn();
  });

  test('should be definied', () => {
    expect(middleware).toBeDefined();
  });

  test('should be called findById with correct params', async () => {
    const httpRequest = makeFakeHttpRequest();

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(makeFakeUser());

    await middleware.handle(httpRequest, httpResponse, next);
  });
});
