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

  test('Should return a valid hash on hash success', async () => {
    const hash = await bcryptProvider.hash('any_value');

    expect(hash).toBe('hash');
  });

  test('Should throw if hash throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const hashPromise = bcryptProvider.hash('any_value');

    await expect(hashPromise).rejects.toThrow();
  });
});
