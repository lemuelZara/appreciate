import httpRequest from 'supertest';

import auth from '~config/auth';

import { User } from '~modules/users/entities';

import { JsonWebTokenProvider } from '~shared/container/providers/jwt/impl/json-web-token.provider';
import { BadRequestException } from '~shared/errors/http-errors';
import { prisma } from '~shared/infra/database/prisma/client';
import { app } from '~shared/infra/http/app';

describe('Users', () => {
  let userInput: Partial<User>;
  const jwt = new JsonWebTokenProvider();

  beforeEach(() => {
    userInput = {
      name: 'any_name',
      email: 'any_email',
      admin: true,
      password: 'any_password'
    };
  });

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

  describe('POST /users', () => {
    test('should be able create a new admin user', async () => {
      const httpResponse = await httpRequest(app)
        .post('/users')
        .expect(201)
        .send(userInput);

      delete userInput.password;
      delete httpResponse.body.password;

      expect(httpResponse.body).toStrictEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        admin: true,
        ...userInput
      });
    });

    test('should be able create a new non admin user', async () => {
      userInput.admin = false;

      const httpResponse = await httpRequest(app)
        .post('/users')
        .expect(201)
        .send(userInput);

      delete userInput.password;
      delete httpResponse.body.password;

      expect(httpResponse.body).toStrictEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        admin: false,
        ...userInput
      });
    });

    test('should not be able create duplicated user', async () => {
      userInput.admin = false;

      await httpRequest(app).post('/users').expect(201).send(userInput);
      const httpResponse = await httpRequest(app)
        .post('/users')
        .expect(400)
        .send(userInput);

      const error = new BadRequestException('User already exists!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });
  });

  describe('GET /users', () => {
    beforeEach(async () => {
      await prisma.user.createMany({
        data: [
          {
            name: 'userTest1',
            email: 'userTest1@mail.com',
            password: 'any_password'
          },
          {
            name: 'userTest2',
            email: 'userTest2@mail.com',
            password: 'any_password'
          }
        ]
      });
    });

    test('should be able list all users', async () => {
      const token = jwt.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: 'any_id',
        expiresIn: auth.expiresIn
      });

      const httpResponse = await httpRequest(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(httpResponse.body.length).toBe(2);
    });
  });
});
