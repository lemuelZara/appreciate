import { sign, verify, Algorithm } from 'jsonwebtoken';

import { JWTProtocols } from '~shared/container/providers/jwt/protocols';
import { GenerateTokenConfigDTO, DecodeTokenResponseDTO } from '../dtos';

export class JsonWebTokenProvider implements JWTProtocols {
  public generateToken(secret: string, config: GenerateTokenConfigDTO): string {
    const token = sign(config.payload || {}, secret, {
      algorithm: config.algorithm as Algorithm,
      subject: config.subject,
      expiresIn: config.expiresIn
    });

    return token;
  }

  public decodeToken<T extends DecodeTokenResponseDTO>(
    token: string,
    secret: string
  ): T {
    const decoded = verify(token, secret) as unknown as T;

    return decoded;
  }
}
