import httpRequest from 'supertest';

import { resetDB, disconnectDB } from './utils';

import {
  BadRequestException,
  UnauthorizedException
} from '~shared/errors/http-errors';
import { app } from '~shared/infra/http/app';
import { TagFactory, createToken, UserFactory } from './factories';

describe('Tags', () => {
  afterEach(async () => resetDB());

  afterEach(async () => disconnectDB());

  describe('POST /tags', () => {
    test('should not be able create tag if token is missing', async () => {
      const httpResponse = await httpRequest(app)
        .get('/tags')
        .expect(401)
        .send();

      const error = new UnauthorizedException(
        'Authentication token is missing!'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should not be able create tag if name not provided', async () => {
      const tag = TagFactory.build();
      tag.name = '';

      const userAdmin = await UserFactory.create({ admin: true });

      const token = createToken(userAdmin.id);

      const httpResponse = await httpRequest(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .send(tag);

      const error = new BadRequestException('Name not provided!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should not be able create duplicated tag', async () => {
      const tag = TagFactory.build();
      const userAdmin = await UserFactory.create({ admin: true });

      const token = createToken(userAdmin.id);

      await httpRequest(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .send(tag);

      const httpResponse = await httpRequest(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .send(tag);

      const error = new BadRequestException('Tag already exists!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should not be authorized to create a new tag', async () => {
      const tag = TagFactory.build();
      const userNotAdmin = await UserFactory.create({ admin: false });

      const token = createToken(userNotAdmin.id);

      const httpResponse = await httpRequest(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .send(tag);

      const error = new UnauthorizedException('User is not admin!');

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able create a new tag', async () => {
      const tag = TagFactory.build();
      const userAdmin = await UserFactory.create({ admin: true });

      const token = createToken(userAdmin.id);

      const httpResponse = await httpRequest(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .send(tag);

      expect(httpResponse.body).toStrictEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        ...tag
      });
    });
  });

  describe('GET /tags', () => {
    test('should not be able list all tags if token is missing', async () => {
      const httpResponse = await httpRequest(app)
        .get('/tags')
        .expect(401)
        .send();

      const error = new UnauthorizedException(
        'Authentication token is missing!'
      );

      expect(httpResponse.body.content).toStrictEqual(error.response);
    });

    test('should be able list all tags', async () => {
      const userAdmin = await UserFactory.create({ admin: true });

      const tags = await Promise.all([
        await TagFactory.create(),
        await TagFactory.create(),
        await TagFactory.create(),
        await TagFactory.create(),
        await TagFactory.create()
      ]);

      const token = createToken(userAdmin.id);

      const httpResponse = await httpRequest(app)
        .get('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(
        httpResponse.body.map((res) => ({
          ...res,
          createdAt: new Date(res.createdAt),
          updatedAt: new Date(res.updatedAt)
        }))
      ).toEqual(tags);
    });
  });
});
