import bcrypt from 'bcrypt';

import { BCryptProvider } from './bcrypt.provider';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  }
}));

describe('BCryptProvider', () => {
  const salt = 12;
  let bcryptProvider: BCryptProvider;

  beforeEach(() => {
    bcryptProvider = new BCryptProvider(salt);
  });

  test('should call hash with correct params', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await bcryptProvider.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });
});
