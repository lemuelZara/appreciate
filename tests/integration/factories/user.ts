import faker from 'faker';
import { Prisma } from '@prisma/client';

import { createFactory } from '../utils';

const DEFAULT_ATTRIBUTES = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  admin: faker.datatype.boolean()
};

export const UserFactory = createFactory<Prisma.UserCreateInput>(
  'user',
  DEFAULT_ATTRIBUTES
);
