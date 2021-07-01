import faker from 'faker';
import { Prisma } from '@prisma/client';

import { createFactory } from '../utils';

const DEFAULT_ATTRIBUTES = {
  name: faker.lorem.word(10)
};

export const TagFactory = createFactory<Prisma.TagCreateInput>(
  'tag',
  DEFAULT_ATTRIBUTES
);
