import { container } from 'tsyringe';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';

container.registerSingleton<UserRepositoryProtocols>('UserRepository', UserRepository);
