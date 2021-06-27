import { ComplimentRepository } from './compliment.repository';

import { Compliment } from '~modules/compliments/entities';
import { AddComplimentDTO } from '~modules/compliments/dtos';

import { prisma } from '~shared/infra/database/prisma/client';

const createdAt = new Date();
const updatedAt = new Date();

const makeFakeComplimentData = (): AddComplimentDTO => ({
  message: 'valid_message',
  tagId: 'valid_tagId',
  userReceiverId: 'valid_userReceiverId',
  userSenderId: 'valid_userSenderId'
});

const makeFakeCompliment = (): Compliment => ({
  id: 'valid_id',
  message: 'valid_message',
  tagId: 'valid_tagId',
  userReceiverId: 'valid_userReceiverId',
  userSenderId: 'valid_userSenderId',
  createdAt,
  updatedAt
});

describe('ComplimentRepository', () => {
  let repository: ComplimentRepository;

  beforeEach(() => {
    repository = new ComplimentRepository();

    prisma.compliment.create = jest.fn();
  });

  test('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('add', () => {
    test('should be called create with correct params', async () => {
      jest
        .spyOn(prisma.compliment, 'create')
        .mockResolvedValue({} as Compliment);

      await repository.add(makeFakeComplimentData());

      expect(prisma.compliment.create).toHaveBeenCalledWith({
        data: {
          message: 'valid_message',
          tag: {
            connect: {
              id: 'valid_tagId'
            }
          },
          userSender: {
            connect: {
              id: 'valid_userSenderId'
            }
          },
          userReceiver: {
            connect: {
              id: 'valid_userReceiverId'
            }
          }
        }
      });
    });
  });
});
