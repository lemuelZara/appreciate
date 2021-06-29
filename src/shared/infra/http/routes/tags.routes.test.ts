import httpRequest from 'supertest';

import auth from '~config/auth';

import { Tag } from '~modules/tags/entities';
import { User } from '~modules/users/entities';

import { JsonWebTokenProvider } from '~shared/container/providers/jwt/impl/json-web-token.provider';
import {
  BadRequestException,
  UnauthorizedException
} from '~shared/errors/http-errors';
import { prisma } from '~shared/infra/database/prisma/client';
import { app } from '~shared/infra/http/app';

describe('Tags', () => {
  let userAdmin: User;
  let userNotAdmin: User;
  let tagInput: Partial<Tag>;
  const jwt = new JsonWebTokenProvider();

  beforeEach(() => {
    tagInput = {
      name: 'any_name'
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

  describe('POST /tags', () => {
    beforeEach(async () => {
      userAdmin = await prisma.user.create({
        data: {
          name: 'userTest',
          email: 'userTest@mail.com',
          password: 'any_password',
          admin: true
        }
      });

      userNotAdmin = await prisma.user.create({
        data: {
          name: 'userTest',
          email: 'userTest@mail.com',
          password: 'any_password',
          admin: false
        }
      });
    });

    test('should be able to create a new tag', async () => {
      const token = jwt.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: userAdmin.id,
        expiresIn: auth.expiresIn
      });

      const httpResponse = await httpRequest(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .send({
          name: 'any_name'
        });

      expect(httpResponse.body).toStrictEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        ...tagInput
      });
    });

    test('should not be able to create duplicated tag', async () => {
      const token = jwt.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: userAdmin.id,
        expiresIn: auth.expiresIn
      });

      await httpRequest(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .send({
          name: 'any_name'
        });
      const httpResponse = await httpRequest(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .send({
          name: 'any_name'
        });

      const error = new BadRequestException('Tag already exists!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should not be authorized to create a new tag', async () => {
      const token = jwt.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: userNotAdmin.id,
        expiresIn: auth.expiresIn
      });

      const httpResponse = await httpRequest(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .send({
          name: 'any_name'
        });

      const error = new UnauthorizedException('User is not admin!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });
  });

  describe('GET /tags', () => {
    beforeEach(async () => {
      await prisma.tag.createMany({
        data: [
          {
            name: 'tag1'
          },
          {
            name: 'tag2'
          }
        ]
      });
    });

    test('should be able list tags', async () => {
      const token = jwt.generateToken(auth.privateKey, {
        algorithm: auth.algorithm,
        subject: userAdmin.id,
        expiresIn: auth.expiresIn
      });

      const httpResponse = await httpRequest(app)
        .get('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(httpResponse.body.length).toBe(2);
    });
  });
});
