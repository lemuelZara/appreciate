import { container } from 'tsyringe';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';

import { TagRepositoryProtocols } from '~modules/tags/infra/protocols';
import { TagRepository } from '~modules/tags/infra/repositories';

import { ComplimentRepositoryProtocols } from '~modules/compliments/infra/protocols';
import { ComplimentRepository } from '~modules/compliments/infra/repositories';

import { BCryptProvider } from '~shared/container/providers/crypto/bcrypt';
import { CryptoProtocols } from '~shared/container/providers/crypto/protocols';

import { JWTProtocols } from '~shared/container/providers/jwt/protocols';
import { JsonWebTokenProvider } from './providers/jwt/impl/json-web-token.provider';

container.registerSingleton<UserRepositoryProtocols>(
  'UserRepository',
  UserRepository
);

container.registerSingleton<TagRepositoryProtocols>(
  'TagRepository',
  TagRepository
);

container.registerSingleton<ComplimentRepositoryProtocols>(
  'ComplimentRepository',
  ComplimentRepository
);

container.registerInstance<CryptoProtocols>(
  'CryptoProvider',
  new BCryptProvider(12)
);

container.registerSingleton<JWTProtocols>('JWTProvider', JsonWebTokenProvider);
