import jwt from 'jsonwebtoken';

import { JsonWebTokenProvider } from './json-web-token.provider';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token';
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
});
