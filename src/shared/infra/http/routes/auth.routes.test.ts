import httpRequest from 'supertest';

import auth from '~config/auth';

import { BCryptProvider } from '~shared/container/providers/crypto/bcrypt';
import { JsonWebTokenProvider } from '~shared/container/providers/jwt/impl/json-web-token.provider';
import { BadRequestException } from '~shared/errors/http-errors';
import { prisma } from '~shared/infra/database/prisma/client';
import { app } from '~shared/infra/http/app';

describe('Auth', () => {
  const jwt = new JsonWebTokenProvider();
  const bcrypt = new BCryptProvider(12);

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

  describe('POST /sessions', () => {
    beforeEach(async () => {
      await prisma.user.create({
        data: {
          name: 'userTest',
          email: 'userTest@mail.com',
          password: await bcrypt.hash('any_password')
        }
      });
    });

    test('should be able to create session', async () => {
      const httpResponse = await httpRequest(app)
        .post('/sessions')
        .expect(200)
        .send({
          email: 'userTest@mail.com',
          password: 'any_password'
        });

      expect(httpResponse.body.token).toBeTruthy();
      expect(
        jwt.decodeToken(httpResponse.body.token, auth.publicKey)
      ).toBeTruthy();
    });

    test('should not be able to create session with non existent user', async () => {
      const httpResponse = await httpRequest(app)
        .post('/sessions')
        .expect(400)
        .send({
          email: 'userTestInvalid@mail.com',
          password: 'any_password_invalid'
        });

      const error = new BadRequestException(
        'Incorrect credentials, try again.'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should not be able to create session with wrong password', async () => {
      const httpResponse = await httpRequest(app)
        .post('/sessions')
        .expect(400)
        .send({
          email: 'userTest@mail.com',
          password: 'any_password_invalid'
        });

      const error = new BadRequestException(
        'Incorrect credentials, try again.'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });
  });
});
