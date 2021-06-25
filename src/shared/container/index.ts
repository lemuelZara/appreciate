import { container } from 'tsyringe';

import { TagRepositoryProtocols } from '~modules/tags/infra/protocols';
import { TagRepository } from '~modules/tags/infra/repositories';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';

container.registerSingleton<UserRepositoryProtocols>(
  'UserRepository',
  UserRepository
);

container.registerSingleton<TagRepositoryProtocols>(
  'TagRepository',
  TagRepository
);
