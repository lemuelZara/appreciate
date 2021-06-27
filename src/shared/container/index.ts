import { container } from 'tsyringe';

import { TagRepositoryProtocols } from '~modules/tags/infra/protocols';
import { TagRepository } from '~modules/tags/infra/repositories';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';

import { BCryptProvider } from '~shared/container/providers/crypto/bcrypt';
import { CryptoProtocols } from '~shared/container/providers/crypto/protocols';

container.registerSingleton<UserRepositoryProtocols>(
  'UserRepository',
  UserRepository
);

container.registerSingleton<TagRepositoryProtocols>(
  'TagRepository',
  TagRepository
);

container.registerInstance<CryptoProtocols>(
  'CryptoProvider',
  new BCryptProvider(12)
);
