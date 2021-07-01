import { JsonWebTokenProvider } from '~shared/container/providers/jwt/impl/json-web-token.provider';
import auth from '~config/auth';

export function createToken(id: string): string {
  return new JsonWebTokenProvider().generateToken(auth.privateKey, {
    algorithm: auth.algorithm,
    subject: id,
    expiresIn: auth.expiresIn
  });
}
