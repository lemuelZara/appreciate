import { ListUserSendComplimentsUseCase } from './list-user-send-compliments.usecase';

import { ComplimentRepositoryProtocols } from '~modules/compliments/infra/protocols';
import { ComplimentRepository } from '~modules/compliments/infra/repositories';
import { Compliment } from '~modules/compliments/entities';

import { Tag } from '~modules/tags/entities';

import { User } from '~modules/users/entities';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeUserSendCompliments = (): (Compliment & {
  tag: Tag;
  userReceiver: User;
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
    userReceiver: {
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

describe('ListUserSendComplimentsUseCase', () => {
  let usecase: ListUserSendComplimentsUseCase;
  let repository: ComplimentRepositoryProtocols;

  beforeEach(() => {
    repository = new ComplimentRepository();
    usecase = new ListUserSendComplimentsUseCase(repository);

    repository.findUserSendCompliments = jest.fn();
  });

  test('should be called findUserSendCompliments with correct params', async () => {
    jest
      .spyOn(repository, 'findUserSendCompliments')
      .mockResolvedValueOnce(makeFakeUserSendCompliments());

    await usecase.execute({ userId: 'any_id' });

    expect(repository.findUserSendCompliments).toHaveBeenCalledWith('any_id');
  });

  test('should be return success user send compliments data', async () => {
    jest
      .spyOn(repository, 'findUserSendCompliments')
      .mockResolvedValueOnce(makeFakeUserSendCompliments());

    const compliments = await usecase.execute({ userId: 'any_id' });

    expect(compliments).toEqual(makeFakeUserSendCompliments());
  });
});
