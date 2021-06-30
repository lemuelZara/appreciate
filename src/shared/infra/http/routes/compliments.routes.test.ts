import httpRequest from 'supertest';

import auth from '~config/auth';

import { ComplimentRepository } from '~modules/compliments/infra/repositories';

import { AddTagDTO } from '~modules/tags/dtos';
import { TagRepository } from '~modules/tags/infra/repositories';

import { AddUserDTO } from '~modules/users/dtos';
import { UserRepository } from '~modules/users/infra/repositories';

import { JsonWebTokenProvider } from '~shared/container/providers/jwt/impl/json-web-token.provider';
import { BadRequestException } from '~shared/errors/http-errors';
import { prisma } from '~shared/infra/database/prisma/client';
import { app } from '~shared/infra/http/app';

describe('Compliments', () => {
  let tag: AddTagDTO;
  let userSender: AddUserDTO;
  let userReceiver: AddUserDTO;
  let message: string;
  let token: string;

  const tagRepository = new TagRepository();
  const userRepository = new UserRepository();
  const complimentRepository = new ComplimentRepository();
  const jwtProvider = new JsonWebTokenProvider();

  afterEach(async () => {
    const deleteComplimentsDetails = prisma.compliment.deleteMany();
    const deleteTagsDetails = prisma.tag.deleteMany();
    const deleteUsersDetails = prisma.user.deleteMany();

    await prisma.$transaction([
      deleteComplimentsDetails,
      deleteTagsDetails,
      deleteUsersDetails
    ]);

    await prisma.$disconnect();
  });

  describe('POST /compliments', () => {
    test('should not be able to create a new compliment if userSender and userReceiver is the same user', async () => {
      tag = {
        name: 'anyTagName'
      };

      userSender = {
        name: 'anyUserSenderName',
        email: 'anyUserSenderEmail',
        password: 'anyUserSenderPassword',
        admin: true
      };

      message = 'anyMessage';

      const [{ id: tagId }, { id: userSenderId }] = await Promise.all([
        await tagRepository.add(tag),
        await userRepository.add(userSender)
      ]);

      token = jwtProvider.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: userSenderId,
        expiresIn: auth.expiresIn
      });

      const httpResponse = await httpRequest(app)
        .post('/compliments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          message,
          tagId,
          userReceiverId: userSenderId
        });

      const error = new BadRequestException('Incorrect User Receiver/Sender!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should not be able to create a new compliment if userReceiver not exists', async () => {
      tag = {
        name: 'anyTagName'
      };

      userSender = {
        name: 'anyUserSenderName',
        email: 'anyUserSenderEmail',
        password: 'anyUserSenderPassword',
        admin: true
      };

      message = 'anyMessage';

      const [{ id: tagId }, { id: userSenderId }] = await Promise.all([
        await tagRepository.add(tag),
        await userRepository.add(userSender)
      ]);

      token = jwtProvider.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: userSenderId,
        expiresIn: auth.expiresIn
      });

      const httpResponse = await httpRequest(app)
        .post('/compliments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          message,
          tagId,
          userReceiverId: '87cc44ff-3678-4dfc-8eca-4d124b5d0ec3'
        });

      const error = new BadRequestException('User Receiver does not exists!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able to create a new compliment', async () => {
      tag = {
        name: 'anyTagName'
      };

      userSender = {
        name: 'anyUserSenderName',
        email: 'anyUserSenderEmail',
        password: 'anyUserSenderPassword',
        admin: true
      };

      userReceiver = {
        name: 'anyUserSenderName',
        email: 'anyUserSenderEmail',
        password: 'anyUserSenderPassword',
        admin: true
      };

      message = 'anyMessage';

      const [{ id: tagId }, { id: userSenderId }, { id: userReceiverId }] =
        await Promise.all([
          await tagRepository.add(tag),
          await userRepository.add(userSender),
          await userRepository.add(userReceiver)
        ]);

      token = jwtProvider.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: userSenderId,
        expiresIn: auth.expiresIn
      });

      const httpResponse = await httpRequest(app)
        .post('/compliments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          message,
          tagId,
          userReceiverId
        });

      expect(httpResponse.body).toStrictEqual({
        id: expect.any(String),
        tagId,
        userSenderId,
        userReceiverId,
        message,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });
  });
  describe('GET /compliments/users/receive', () => {
    test('should be able list received compliments', async () => {
      tag = {
        name: 'anyTagName'
      };

      userSender = {
        name: 'anyUserSenderName',
        email: 'anyUserSenderEmail',
        password: 'anyUserSenderPassword',
        admin: true
      };

      userReceiver = {
        name: 'anyUserReceiverName',
        email: 'anyUserReceiverEmail',
        password: 'anyUserReceiverPassword',
        admin: true
      };

      const [createdTag, createdUserSender, createdUserReceiver] =
        await Promise.all([
          await tagRepository.add(tag),
          await userRepository.add(userSender),
          await userRepository.add(userReceiver)
        ]);

      const compliment = await complimentRepository.add({
        message,
        tagId: createdTag.id,
        userSenderId: createdUserSender.id,
        userReceiverId: createdUserReceiver.id
      });

      token = jwtProvider.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: createdUserReceiver.id,
        expiresIn: auth.expiresIn
      });

      const httpResponse = await httpRequest(app)
        .get('/compliments/users/receive')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(httpResponse.body).toMatchObject([
        {
          ...compliment,
          createdAt: compliment.createdAt.toISOString(),
          updatedAt: compliment.updatedAt.toISOString()
        }
      ]);
    });
  });
  describe('GET /compliments/users/send', () => {
    test('should be able list sent compliments', async () => {
      tag = {
        name: 'anyTagName'
      };

      userSender = {
        name: 'anyUserSenderName',
        email: 'anyUserSenderEmail',
        password: 'anyUserSenderPassword',
        admin: true
      };

      userReceiver = {
        name: 'anyUserReceiverName',
        email: 'anyUserReceiverEmail',
        password: 'anyUserReceiverPassword',
        admin: true
      };

      const [createdTag, createdUserSender, createdUserReceiver] =
        await Promise.all([
          await tagRepository.add(tag),
          await userRepository.add(userSender),
          await userRepository.add(userReceiver)
        ]);

      const compliment = await complimentRepository.add({
        message,
        tagId: createdTag.id,
        userSenderId: createdUserSender.id,
        userReceiverId: createdUserReceiver.id
      });

      token = jwtProvider.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: createdUserSender.id,
        expiresIn: auth.expiresIn
      });

      const httpResponse = await httpRequest(app)
        .get('/compliments/users/send')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(httpResponse.body).toMatchObject([
        {
          ...compliment,
          createdAt: compliment.createdAt.toISOString(),
          updatedAt: compliment.updatedAt.toISOString()
        }
      ]);
    });
  });
});
