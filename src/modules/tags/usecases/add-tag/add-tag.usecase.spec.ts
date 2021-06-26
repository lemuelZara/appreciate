import { AddTagUseCase } from './add-tag.usecase';

import { TagRepositoryProtocols } from '~modules/tags/infra/protocols';
import { TagRepository } from '~modules/tags/infra/repositories';
import { AddTagDTO } from '~modules/tags/dtos';

import { BadRequestException } from '~shared/errors/http-errors';

const makeFakeTagData = (): AddTagDTO => ({
  name: 'valid_name'
});

describe('AddTagUseCase', () => {
  let usecase: AddTagUseCase;
  let repository: TagRepositoryProtocols;

  beforeEach(() => {
    repository = new TagRepository();
    usecase = new AddTagUseCase(repository);

    repository.add = jest.fn();
    repository.findByName = jest.fn();
  });

  test('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  test('should be throw if name not provided', async () => {
    const tagData = makeFakeTagData();

    tagData.name = '';

    await expect(usecase.execute(tagData)).rejects.toEqual(
      new BadRequestException('Name not provided!')
    );
  });
});
