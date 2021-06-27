import { AddComplimentUseCase } from './add-compliment.usecase';

import { AddComplimentDTO } from '~modules/compliments/dtos';
import { Compliment } from '~modules/compliments/entities';
import { ComplimentRepositoryProtocols } from '~modules/compliments/infra/protocols';
import { ComplimentRepository } from '~modules/compliments/infra/repositories';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { UserRepository } from '~modules/users/infra/repositories';

import { BadRequestException } from '~shared/errors/http-errors';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeComplimentData = (): AddComplimentDTO => ({
  message: 'valid_message',
  tagId: 'valid_tagId',
  userSenderId: 'valid_userSenderId',
  userReceiverId: 'valid_userReceiverId'
});

const makeFakeCompliment = (): Compliment => ({
  id: 'valid_id',
  message: 'valid_message',
  tagId: 'valid_tagId',
  userSenderId: 'valid_userSenderId',
  userReceiverId: 'valid_userReceiverId',
  createdAt,
  updatedAt
});

describe('AddComplimentUseCase', () => {
  let usecase: AddComplimentUseCase;
  let userRepository: UserRepositoryProtocols;
  let complimentRepository: ComplimentRepositoryProtocols;

  beforeEach(async () => {
    userRepository = new UserRepository();
    complimentRepository = new ComplimentRepository();
    usecase = new AddComplimentUseCase(complimentRepository, userRepository);

    userRepository.findById = jest.fn();
    complimentRepository.add = jest.fn();
  });

  test('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  test('should be throw if user sender equals user receiver', async () => {
    const complimentData = makeFakeComplimentData();

    complimentData.userReceiverId = 'valid_userSenderId';

    await expect(usecase.execute(complimentData)).rejects.toEqual(
      new BadRequestException('Incorrect User Receiver/Sender!')
    );
  });
});
