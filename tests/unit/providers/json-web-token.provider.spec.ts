import jwt from 'jsonwebtoken';

import { JsonWebTokenProvider } from '~shared/container/providers/jwt/impl/json-web-token.provider';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token';
  },
  verify(): string {
    return 'any_decoded_token';
  }
}));

describe('JsonWebTokenProvider', () => {
  let provider: JsonWebTokenProvider;

  beforeEach(() => {
    provider = new JsonWebTokenProvider();
  });

  test('should be defined', () => {
    expect(provider).toBeDefined();
  });

  test('should call sign with correct params', async () => {
    const signSpy = jest.spyOn(jwt, 'sign');

    provider.generateToken('secret', {
      algorithm: 'RS256',
      subject: 'any_id',
      expiresIn: '1d'
    });

    expect(signSpy).toHaveBeenCalledWith({}, 'secret', {
      algorithm: 'RS256',
      subject: 'any_id',
      expiresIn: '1d'
    });
  });

  test('should return a token on sign success', async () => {
    const token = provider.generateToken('secret', {
      algorithm: 'RS256',
      subject: 'any_id',
      expiresIn: '1d'
    });

    expect(token).toBe('any_token');
  });

  test('should throw if sign throws', async () => {
    jest.spyOn(jwt, 'sign').mockImplementation(() => new Error());

    provider.generateToken('secret', {
      algorithm: 'RS256',
      subject: 'any_id',
      expiresIn: '1d'
    });

    expect(provider.generateToken).toThrow();
  });

  test('should call verify with correct params', async () => {
    const signSpy = jest.spyOn(jwt, 'verify');

    provider.decodeToken('any_token', 'secret');

    expect(signSpy).toHaveBeenCalledWith('any_token', 'secret');
  });

  test('should return a decoded token on verify success', async () => {
    const decodedToken = provider.decodeToken('any_token', 'secret');

    expect(decodedToken).toBe('any_decoded_token');
  });

  test('should throw if verify throws', async () => {
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      return new Error();
    });

    const decoded = provider.decodeToken('any_token', 'secret');

    expect(decoded).toStrictEqual(new Error());
  });
});
