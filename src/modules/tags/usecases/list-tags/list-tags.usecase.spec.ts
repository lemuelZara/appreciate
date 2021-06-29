import { ListTagsUseCase } from './list-tags.usecase';

import { TagRepositoryProtocols } from '~modules/tags/infra/protocols';
import { TagRepository } from '~modules/tags/infra/repositories';
import { Tag } from '~modules/tags/entities';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeFindAllTags = (): Tag[] => [
  {
    id: 'any_id',
    name: 'any_name',
    createdAt,
    updatedAt
  }
];

describe('ListTagsUseCase', () => {
  let usecase: ListTagsUseCase;
  let repository: TagRepositoryProtocols;

  beforeEach(() => {
    repository = new TagRepository();
    usecase = new ListTagsUseCase(repository);

    repository.findAll = jest.fn();
  });

  test('should be return success tags data', async () => {
    jest
      .spyOn(repository, 'findAll')
      .mockResolvedValueOnce(makeFakeFindAllTags());

    const tags = await usecase.execute();

    expect(tags).toEqual(makeFakeFindAllTags());
  });
});
