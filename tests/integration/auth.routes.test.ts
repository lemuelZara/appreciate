import httpRequest from 'supertest';

import { disconnectDB, resetDB } from './utils';
import { hash, UserFactory, decodeToken } from './factories';

import { BadRequestException } from '~shared/errors/http-errors';
import { app } from '~shared/infra/http/app';

describe('Auth', () => {
  afterEach(async () => resetDB());

  afterEach(async () => disconnectDB());

  describe('POST /sessions', () => {
    test('should not be able create session with non existent user', async () => {
      const { email, password } = UserFactory.build();

      const httpResponse = await httpRequest(app)
        .post('/sessions')
        .expect(400)
        .send({
          email,
          password
        });

      const error = new BadRequestException(
        'Incorrect credentials, try again.'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able create session with wrong password', async () => {
      const user = UserFactory.build();

      const { email } = await UserFactory.create({
        password: await hash(user.password)
      });

      const httpResponse = await httpRequest(app)
        .post('/sessions')
        .expect(400)
        .send({
          email,
          password: 'invalid_password'
        });

      const error = new BadRequestException(
        'Incorrect credentials, try again.'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able create session', async () => {
      const user = UserFactory.build();

      const { name, email } = await UserFactory.create({
        password: await hash(user.password)
      });

      const httpResponse = await httpRequest(app)
        .post('/sessions')
        .expect(200)
        .send({
          email,
          password: user.password
        });

      expect(httpResponse.body).toStrictEqual({
        user: {
          name,
          email
        },
        token: expect.any(String)
      });
      expect(decodeToken(httpResponse.body.token)).toBeTruthy();
    });
  });
});
