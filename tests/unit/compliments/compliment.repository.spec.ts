import { ComplimentRepository } from '~modules/compliments/infra/repositories';

import { Compliment } from '~modules/compliments/entities';
import { AddComplimentDTO } from '~modules/compliments/dtos';

import { User } from '~modules/users/entities';
import { Tag } from '~modules/tags/entities';

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

describe('ComplimentRepository', () => {
  let repository: ComplimentRepository;

  beforeEach(() => {
    repository = new ComplimentRepository();

    prisma.compliment.create = jest.fn();
    prisma.compliment.findMany = jest.fn();
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

    test('should be throw when create throws', async () => {
      jest.spyOn(prisma.compliment, 'create').mockRejectedValue(new Error());

      const promise = repository.add(makeFakeComplimentData());

      expect(promise).rejects.toThrow(new Error());
    });

    test('should be successfully return compliment created', async () => {
      jest
        .spyOn(prisma.compliment, 'create')
        .mockResolvedValue(makeFakeCompliment());

      expect(
        await repository.add({
          message: 'any_message',
          tagId: 'any_tagId',
          userReceiverId: 'any_userReceivedId',
          userSenderId: 'any_userSenderId'
        })
      ).toEqual(makeFakeCompliment());
    });
  });

  describe('findUserReceiveCompliments', () => {
    test('should be called findMany with correct params', async () => {
      jest
        .spyOn(prisma.compliment, 'findMany')
        .mockResolvedValue([] as Compliment[]);

      await repository.findUserReceiveCompliments('any_userId');

      expect(prisma.compliment.findMany).toHaveBeenCalledWith({
        where: { userReceiverId: 'any_userId' },
        include: {
          tag: true,
          userSender: true
        }
      });
    });

    test('should be throw when findMany throws', async () => {
      jest.spyOn(prisma.compliment, 'findMany').mockRejectedValue(new Error());

      const promise = repository.findUserReceiveCompliments('any_userId');

      expect(promise).rejects.toThrow(new Error());
    });

    test('should be successfully return user received compliments', async () => {
      jest
        .spyOn(prisma.compliment, 'findMany')
        .mockResolvedValue(makeFakeUserReceiveCompliments());

      expect(await repository.findUserReceiveCompliments('any_userId')).toEqual(
        makeFakeUserReceiveCompliments()
      );
    });
  });

  describe('findUserSendCompliments', () => {
    test('should be called findMany with correct params', async () => {
      jest
        .spyOn(prisma.compliment, 'findMany')
        .mockResolvedValue([] as Compliment[]);

      await repository.findUserSendCompliments('any_userId');

      expect(prisma.compliment.findMany).toHaveBeenCalledWith({
        where: { userSenderId: 'any_userId' },
        include: {
          tag: true,
          userReceiver: true
        }
      });
    });

    test('should be throw when findMany throws', async () => {
      jest.spyOn(prisma.compliment, 'findMany').mockRejectedValue(new Error());

      const promise = repository.findUserSendCompliments('any_userId');

      expect(promise).rejects.toThrow(new Error());
    });

    test('should be successfully return user send compliments', async () => {
      jest
        .spyOn(prisma.compliment, 'findMany')
        .mockResolvedValue(makeFakeUserSendCompliments());

      expect(await repository.findUserSendCompliments('any_userId')).toEqual(
        makeFakeUserSendCompliments()
      );
    });
  });
});
