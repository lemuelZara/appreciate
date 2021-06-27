import {
  JWT_ALGORITHM,
  JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY,
  TOKEN_EXPIRATION_TIME
} from '~shared/utils/env';

type AuthConfig = {
  algorithm: string;
  privateKey: string;
  publicKey: string;
  expiresIn: string;
};

export default {
  algorithm: JWT_ALGORITHM,
  privateKey: JWT_PRIVATE_KEY,
  publicKey: JWT_PUBLIC_KEY,
  expiresIn: TOKEN_EXPIRATION_TIME
} as AuthConfig;
