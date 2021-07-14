import { Test, TestingModule } from '@nestjs/testing';
import * as Faker from 'faker';
import { matchers } from 'jest-json-schema';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateAuthorRequestBuilder } from '../src/utils/test/authors';

describe('AuthorsController (e2e)', () => {
  let app: INestApplication;
  let token = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    expect.extend(matchers);
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: Faker.internet.password(),
        gender: 'male',
      })
      .expect(201)
      .expect(function (res) {
        token = res.body.token;
      });
  });

  describe('/authors (POST)', () => {
    it('should create an author', async () => {
      // arrange
      const body = await new CreateAuthorRequestBuilder()
        .withDefaultConfigs()
        .build();

      const url = app.getHttpServer().listen().address();
      const baseUrl = 'http://127.0.0.1:' + url.port;
      const pattern = new RegExp('^' + baseUrl + '/author/[0-9]+$', 'g');

      let location = '';

      // act & assert
      await request(app.getHttpServer())
        .post('/author')
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .expect(201)
        .expect(function (res) {
          expect(res.body).toStrictEqual({});
          expect(res.headers.location).toMatch(pattern);
          location = res.headers.location.replace(baseUrl, '');
        });

      await request(app.getHttpServer())
        .get(location)
        .set('Authorization', `Bearer ${token}`)
        .expect((res) => {
          expect(res.body.name).toBe(body.name);
        })
        .expect(200);
    });
  });

  describe('/authors (GET)', () => {
    beforeAll(async () => {
      const body = await new CreateAuthorRequestBuilder()
        .withDefaultConfigs()
        .buildList(11);

      const size = body.length;
      for (let index = 0; index < size; index++) {
        await request(app.getHttpServer())
          .post('/author')
          .set('Authorization', `Bearer ${token}`)
          .send(body[index])
          .expect(201);
      }
    });

    it('should be paged', async () => {
      // arrange

      // act & assert
      await request(app.getHttpServer())
        .get('/author?limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(function (res) {
          expect(res.body.length).toBeLessThanOrEqual(10);
        });
    });

    it('should be compliant with json schema', async () => {
      // arrange
      const schema = {
        type: 'array',
        items: [
          {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
              },
              name: {
                type: 'string',
              },
              books: {
                type: 'array',
                items: [
                  {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                      },
                      name: {
                        type: 'string',
                      },
                      edition: {
                        type: 'string',
                      },
                      publicationYear: {
                        type: 'integer',
                      },
                    },
                    required: ['id', 'name', 'edition', 'publicationYear'],
                  },
                ],
              },
            },
            required: ['id', 'name', 'books'],
          },
        ],
      };

      // act & assert
      await request(app.getHttpServer())
        .get('/author?limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(function (res) {
          expect(res.body).toMatchSchema(schema);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
