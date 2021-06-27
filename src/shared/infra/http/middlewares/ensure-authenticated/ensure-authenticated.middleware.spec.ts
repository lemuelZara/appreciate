import { Request } from 'express';

import { EnsureAuthenticatedMiddleware } from './ensure-authenticated.middleware';

import { JWTProtocols } from '~shared/container/providers/jwt/protocols';
import { JsonWebTokenProvider } from '~shared/container/providers/jwt/impl/json-web-token.provider';
import { UnauthorizedException } from '~shared/errors/http-errors';

describe('EnsureAuthenticatedMiddleware', () => {
  let middleware: EnsureAuthenticatedMiddleware;
  let provider: JWTProtocols;
  const httpRequest = {
    headers: {
      authorization: `Bearer any_token`
    }
  } as Request;

  const httpResponse = {
    status: jest.fn(() => httpResponse),
    json: jest.fn()
  };

  const next = jest.fn();

  beforeEach(() => {
    provider = new JsonWebTokenProvider();
    middleware = new EnsureAuthenticatedMiddleware(provider);
  });

  test('should be definied', () => {
    expect(middleware).toBeDefined();
  });

  test('should be throw if authHeader is empty', async () => {
    httpRequest.headers.authorization = '';

    await expect(
      middleware.handle(httpRequest, httpResponse, next)
    ).rejects.toEqual(
      new UnauthorizedException('Authentication token is missing!')
    );
  });
});
