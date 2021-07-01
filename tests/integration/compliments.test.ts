import httpRequest from 'supertest';
import faker from 'faker';

import {
  BadRequestException,
  UnauthorizedException
} from '~shared/errors/http-errors';
import { app } from '~shared/infra/http/app';
import {
  createToken,
  TagFactory,
  UserFactory,
  ComplimentFactory
} from './factories';
import { disconnectDB, resetDB } from './utils';

describe('Compliments', () => {
  afterEach(async () => resetDB());

  afterEach(async () => disconnectDB());

  describe('POST /compliments', () => {
    test('should not be able create compliment if token is missing', async () => {
      const httpResponse = await httpRequest(app)
        .post('/compliments')
        .expect(401)
        .send();

      const error = new UnauthorizedException(
        'Authentication token is missing!'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should not be able to create a new compliment if userSender and userReceiver is the same user', async () => {
      const tag = await TagFactory.create();
      const userSender = await UserFactory.create({ admin: true });

      const token = createToken(userSender.id);

      const httpResponse = await httpRequest(app)
        .post('/compliments')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .send({
          message: 'any_message',
          tagId: tag.id,
          userReceiverId: userSender.id
        });

      const error = new BadRequestException('Incorrect User Receiver/Sender!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should not be able to create a new compliment if userReceiver not exists', async () => {
      const tag = await TagFactory.create();
      const userSender = await UserFactory.create({ admin: true });

      const token = createToken(userSender.id);

      const httpResponse = await httpRequest(app)
        .post('/compliments')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .send({
          message: 'any_message',
          tagId: tag.id,
          userReceiverId: faker.datatype.uuid()
        });

      const error = new BadRequestException('User Receiver does not exists!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able to create a new compliment', async () => {
      const tag = await TagFactory.create();
      const userSender = await UserFactory.create();
      const userReceiver = await UserFactory.create();

      const token = createToken(userSender.id);

      const message = 'any_message';

      const httpResponse = await httpRequest(app)
        .post('/compliments')
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .send({
          message,
          tagId: tag.id,
          userReceiverId: userReceiver.id
        });

      expect(httpResponse.body).toStrictEqual({
        id: expect.any(String),
        message,
        userSenderId: userSender.id,
        userReceiverId: userReceiver.id,
        tagId: tag.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });
  });

  describe('GET /compliments/users/receive', () => {
    test('should not be able list received compliments if token is missing', async () => {
      const httpResponse = await httpRequest(app)
        .get('/compliments/users/receive')
        .expect(401)
        .send();

      const error = new UnauthorizedException(
        'Authentication token is missing!'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able list received compliments', async () => {
      const userSender = await UserFactory.create({ admin: true });
      const userReceiver = await UserFactory.create({ admin: true });

      const tag = await TagFactory.create();

      const message = 'any_message';

      const compliment = await ComplimentFactory.create({
        message,
        tag: { connect: { id: tag.id } },
        userSender: { connect: { id: userSender.id } },
        userReceiver: { connect: { id: userReceiver.id } }
      });

      const token = createToken(userReceiver.id);

      const httpResponse = await httpRequest(app)
        .get('/compliments/users/receive')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(httpResponse.body).toContainEqual({
        id: compliment.id,
        message,
        tagId: tag.id,
        userSenderId: userSender.id,
        userReceiverId: userReceiver.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        tag: {
          ...tag,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        },
        userSender: {
          ...userSender,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }
      });
    });
  });

  describe('GET /compliments/users/send', () => {
    test('should not be able list sent compliments if token is missing', async () => {
      const httpResponse = await httpRequest(app)
        .get('/compliments/users/send')
        .expect(401)
        .send();

      const error = new UnauthorizedException(
        'Authentication token is missing!'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able list sent compliments', async () => {
      const userSender = await UserFactory.create({ admin: true });
      const userReceiver = await UserFactory.create({ admin: true });

      const tag = await TagFactory.create();

      const message = 'any_message';

      const compliment = await ComplimentFactory.create({
        message,
        tag: { connect: { id: tag.id } },
        userSender: { connect: { id: userSender.id } },
        userReceiver: { connect: { id: userReceiver.id } }
      });

      const token = createToken(userSender.id);

      const httpResponse = await httpRequest(app)
        .get('/compliments/users/send')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(httpResponse.body).toContainEqual({
        id: compliment.id,
        message,
        tagId: tag.id,
        userSenderId: userSender.id,
        userReceiverId: userReceiver.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        tag: {
          ...tag,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        },
        userReceiver: {
          ...userReceiver,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }
      });
    });
  });
});
