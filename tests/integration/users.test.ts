import httpRequest from 'supertest';

import { resetDB, disconnectDB } from './utils';
import { UserFactory, createToken } from './factories';

import { app } from '~shared/infra/http/app';
import {
  BadRequestException,
  UnauthorizedException
} from '~shared/errors/http-errors';

describe('Users', () => {
  afterEach(async () => resetDB());

  afterEach(async () => disconnectDB());

  describe('POST /users', () => {
    test('should not be able create userif email is not provided', async () => {
      const userAdmin = UserFactory.build({ admin: true });
      userAdmin.email = '';

      const httpResponse = await httpRequest(app)
        .post('/users')
        .expect(400)
        .send(userAdmin);

      const error = new BadRequestException('Email is not provided!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should not be able create duplicated user', async () => {
      const userAdmin = UserFactory.build({ admin: true });
      const userNotAdmin = UserFactory.build({ admin: false });

      await httpRequest(app).post('/users').expect(201).send(userNotAdmin);

      const httpResponse = await httpRequest(app)
        .post('/users')
        .expect(400)
        .send(userAdmin);

      const error = new BadRequestException('User already exists!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able create a new admin user', async () => {
      const userAdmin = UserFactory.build({ admin: true });

      const httpResponse = await httpRequest(app)
        .post('/users')
        .expect(201)
        .send(userAdmin);

      const { password, ...userData } = userAdmin;

      expect(httpResponse.body).toStrictEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        password: expect.any(String),
        ...userData
      });
    });

    test('should be able create a new non admin user', async () => {
      const userNotAdmin = UserFactory.build({ admin: false });

      const httpResponse = await httpRequest(app)
        .post('/users')
        .expect(201)
        .send(userNotAdmin);

      const { password, ...userData } = userNotAdmin;

      expect(httpResponse.body).toStrictEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        password: expect.any(String),
        admin: false,
        ...userData
      });
    });
  });

  describe('GET /users', () => {
    test('should not be able list all users if token is missing', async () => {
      const httpResponse = await httpRequest(app)
        .get('/users')
        .expect(401)
        .send();

      const error = new UnauthorizedException(
        'Authentication token is missing!'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able list all users', async () => {
      const users = await Promise.all([
        await UserFactory.create(),
        await UserFactory.create(),
        await UserFactory.create(),
        await UserFactory.create(),
        await UserFactory.create()
      ]);

      const token = createToken(users[0].id);

      const httpResponse = await httpRequest(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(
        httpResponse.body.map((res) => ({
          ...res,
          createdAt: new Date(res.createdAt),
          updatedAt: new Date(res.updatedAt)
        }))
      ).toEqual(users);
    });
  });
});
