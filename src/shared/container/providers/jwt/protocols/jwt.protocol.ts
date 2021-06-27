import {
  DecodeTokenResponseDTO,
  GenerateTokenConfigDTO
} from '~shared/container/providers/jwt/dtos';

export type JWTProtocols = {
  generateToken(secret: string, config: GenerateTokenConfigDTO): string;
  decodeToken<T extends DecodeTokenResponseDTO>(
    token: string,
    secret: string
  ): T;
};
