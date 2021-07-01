import httpRequest from 'supertest';

import { resetDB, disconnectDB } from './utils';
import { UserFactory } from './factories/user';

import { app } from '~shared/infra/http/app';
import { BadRequestException } from '~shared/errors/http-errors';
import { createToken } from './factories/jwt';

const userAdmin = UserFactory.build({ admin: true });
const userNotAdmin = UserFactory.build({ admin: false });

describe('Users', () => {
  afterEach(async () => resetDB());

  afterEach(async () => disconnectDB());

  describe('POST /users', () => {
    test('should not be able create duplicated user', async () => {
      await httpRequest(app).post('/users').expect(201).send(userNotAdmin);

      const httpResponse = await httpRequest(app)
        .post('/users')
        .expect(400)
        .send(userAdmin);

      const error = new BadRequestException('User already exists!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able create a new admin user', async () => {
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
