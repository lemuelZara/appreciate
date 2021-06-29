import { ListUserReceiveComplimentsUseCase } from './list-user-receive-compliments.usecase';

import { ComplimentRepositoryProtocols } from '~modules/compliments/infra/protocols';
import { ComplimentRepository } from '~modules/compliments/infra/repositories';
import { Compliment } from '~modules/compliments/entities';

import { Tag } from '~modules/tags/entities';

import { User } from '~modules/users/entities';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeUserReceiveCompliments = (): (Compliment & {
  tag: Tag;
  userSender: User;
})[] => [
  {
    id: 'valid_id',
    message: 'valid_message',
    tagId: 'valid_tagId',
    userReceiverId: 'valid_userReceiverId',
    userSenderId: 'valid_userSenderId',
    createdAt,
    updatedAt,
    tag: {
      id: 'valid_id',
      name: 'valid_name',
      createdAt,
      updatedAt
    },
    userSender: {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
      admin: true,
      createdAt,
      updatedAt
    }
  }
];

describe('ListUserReceiveComplimentsUseCase', () => {
  let usecase: ListUserReceiveComplimentsUseCase;
  let repository: ComplimentRepositoryProtocols;

  beforeEach(() => {
    repository = new ComplimentRepository();
    usecase = new ListUserReceiveComplimentsUseCase(repository);

    repository.findUserReceiveCompliments = jest.fn();
  });

  test('should be called findUserReceiveCompliments with correct params', async () => {
    jest
      .spyOn(repository, 'findUserReceiveCompliments')
      .mockResolvedValueOnce(makeFakeUserReceiveCompliments());

    await usecase.execute({ userId: 'any_id' });

    expect(repository.findUserReceiveCompliments).toHaveBeenCalledWith(
      'any_id'
    );
  });

  test('should be return success user received compliments data', async () => {
    jest
      .spyOn(repository, 'findUserReceiveCompliments')
      .mockResolvedValueOnce(makeFakeUserReceiveCompliments());

    const compliments = await usecase.execute({ userId: 'any_id' });

    expect(compliments).toEqual(makeFakeUserReceiveCompliments());
  });
});
