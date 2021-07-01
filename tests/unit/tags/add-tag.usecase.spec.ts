import { AddTagUseCase } from '~modules/tags/usecases/add-tag/add-tag.usecase';

import { TagRepositoryProtocols } from '~modules/tags/infra/protocols';
import { TagRepository } from '~modules/tags/infra/repositories';
import { Tag } from '~modules/tags/entities';
import { AddTagDTO } from '~modules/tags/dtos';

import { BadRequestException } from '~shared/errors/http-errors';

const makeFakeTagData = (): AddTagDTO => ({
  name: 'valid_name'
});

const makeFakeTag = (): Tag => ({
  id: 'valid_id',
  name: 'valid_name',
  createdAt: new Date(),
  updatedAt: new Date()
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

  test('should be called findByName with correct params', async () => {
    const tagData = makeFakeTagData();

    jest.spyOn(repository, 'findByName').mockResolvedValue(null);

    await usecase.execute(tagData);

    expect(repository.findByName).toBeCalledWith(tagData.name);
  });

  test('should be throw if findByName returns existent tag', async () => {
    const tagData = makeFakeTagData();

    jest.spyOn(repository, 'findByName').mockResolvedValue(makeFakeTag());

    await expect(usecase.execute(tagData)).rejects.toEqual(
      new BadRequestException('Tag already exists!')
    );
  });

  test('should be return created tag', async () => {
    const fakeTag = makeFakeTag();

    jest.spyOn(repository, 'findByName').mockResolvedValue(null);
    jest.spyOn(repository, 'add').mockResolvedValue(fakeTag);

    const createdTag = await usecase.execute({ name: 'valid_name' });

    expect(createdTag).toEqual(fakeTag);
  });
});
