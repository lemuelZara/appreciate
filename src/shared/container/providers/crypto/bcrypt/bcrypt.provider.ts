import bcrypt from 'bcrypt';

import { CryptoProtocols } from '~shared/container/providers/crypto/protocols';

export class BCryptProvider implements CryptoProtocols {
  constructor(private readonly salt: number) {}

  public async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);

    return hash;
  }

  public async compare(value: string, hash: string): Promise<boolean> {
    const hashIsValid = await bcrypt.compare(value, hash);

    return hashIsValid;
  }
}
