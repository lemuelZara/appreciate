import { BCryptProvider } from '~shared/container/providers/crypto/bcrypt';

export function hash(value: string): Promise<string> {
  return new BCryptProvider(12).hash(value);
}
