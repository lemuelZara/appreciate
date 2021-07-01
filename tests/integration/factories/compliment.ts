import faker from 'faker';
import { Prisma } from '@prisma/client';

import { createFactory } from '../utils';

const DEFAULT_ATTRIBUTES = {
  message: faker.lorem.sentence(10)
};

export const ComplimentFactory = createFactory<Prisma.ComplimentCreateInput>(
  'compliment',
  DEFAULT_ATTRIBUTES
);
