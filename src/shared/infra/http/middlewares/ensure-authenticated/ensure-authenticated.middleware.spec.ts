import { Request } from 'express';

import { EnsureAuthenticatedMiddleware } from './ensure-authenticated.middleware';

import { JWTProtocols } from '~shared/container/providers/jwt/protocols';
import { JsonWebTokenProvider } from '~shared/container/providers/jwt/impl/json-web-token.provider';
import { UnauthorizedException } from '~shared/errors/http-errors';

import auth from '~config/auth';

describe('EnsureAuthenticatedMiddleware', () => {
  let middleware: EnsureAuthenticatedMiddleware;
  let provider: JWTProtocols;

  const makeFakeHttpRequest = () =>
    ({
      headers: {
        authorization: 'Bearer any_token'
      }
    } as Request);

  const httpResponse = {
    status: jest.fn(() => httpResponse),
    json: jest.fn()
  };

  const next = jest.fn();

  beforeEach(() => {
    provider = new JsonWebTokenProvider();
    middleware = new EnsureAuthenticatedMiddleware(provider);

    provider.decodeToken = jest.fn();
    auth.publicKey = 'any_secret';
  });

  test('should be definied', () => {
    expect(middleware).toBeDefined();
  });

  test('should be throw if authHeader is empty', async () => {
    const httpRequest = makeFakeHttpRequest();

    httpRequest.headers = {};

    await expect(
      middleware.handle(httpRequest, httpResponse, next)
    ).rejects.toEqual(
      new UnauthorizedException('Authentication token is missing!')
    );
  });

  test('should be called decodeToken with correct params', async () => {
    const httpRequest = makeFakeHttpRequest();

    jest.spyOn(provider, 'decodeToken').mockReturnValueOnce({
      sub: 'any_userId'
    });

    await middleware.handle(httpRequest, httpResponse, next);

    expect(provider.decodeToken).toHaveBeenCalledWith(
      'any_token',
      'any_secret'
    );
  });

  test('should be throw if invalid token is provided', async () => {
    const httpRequest = makeFakeHttpRequest();

    httpRequest.headers.authorization = 'invalid_token';

    await expect(
      middleware.handle(httpRequest, httpResponse, next)
    ).rejects.toEqual(
      new UnauthorizedException(
        'Invalid authentication token, please log in a new session.'
      )
    );
  });

  test('should be authorized', async () => {
    const httpRequest = makeFakeHttpRequest();

    jest.spyOn(provider, 'decodeToken').mockReturnValueOnce({
      sub: 'any_userId'
    });

    await middleware.handle(httpRequest, httpResponse, next);

    expect(next).toHaveBeenCalled();
  });
});
