import { Test, TestingModule } from '@nestjs/testing';
import { matchers } from 'jest-json-schema';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as Faker from 'faker';
import { AppModule } from '../src/app.module';
import { CreateAuthorRequestBuilder } from '../src/utils/test/authors';
import {
  UpdateBookRequestBuilder,
  CreateBookRequestBuilder,
} from '../src/utils/test/books';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let pattern: RegExp;
  let port: number;
  let baseUrl: string;
  let token = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    expect.extend(matchers);
    await app.init();

    const url = app.getHttpServer().listen().address();
    port = url.port;
    baseUrl = 'http://127.0.0.1:' + url.port;
    pattern = new RegExp('^' + baseUrl + '/book/[0-9]+$', 'g');

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

  const createAuthors = async (): Promise<number[]> => {
    const countAuthors = Faker.datatype.number({ min: 3, max: 5 });
    const authorsRequests = await new CreateAuthorRequestBuilder()
      .withDefaultConfigs()
      .buildList(countAuthors);

    const authors: number[] = [];

    for (let i = 0; i < countAuthors; i++) {
      await request(app.getHttpServer())
        .post('/author')
        .set('Authorization', `Bearer ${token}`)
        .send(authorsRequests[i])
        .expect(201)
        .expect((res) => {
          if (res.statusCode === 201) {
            const locationArr = res.headers.location.split('/');
            const id = Number(locationArr[locationArr.length - 1]);
            authors.push(id);
          }
        });
    }

    return authors;
  };

  describe('/books (POST)', () => {
    it('should create a book', async () => {
      // arrange
      const authors = await createAuthors();
      const body = await new CreateBookRequestBuilder()
        .withAuthors(authors)
        .withDefaultConfigs()
        .build();

      let location = '';

      // act & assert
      await request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .expect(201)
        .expect((res) => {
          expect(res.headers.location).toMatch(pattern);
          location = res.headers.location.split(`${port}`)[1];
        });

      await request(app.getHttpServer())
        .get(location)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(body.name);
          expect(res.body.publicationYear).toBe(body.publicationYear);
          expect(res.body.edition).toBe(body.edition);
        });
    });

    // should return 400 if author invalid
  });

  describe('/books (GET)', () => {
    it('should paginate', async () => {
      // arrange
      const authors = await createAuthors();
      const booksRequests = await new CreateBookRequestBuilder()
        .withDefaultConfigs()
        .withAuthors(authors)
        .buildList(11);

      for (let i = 0; i < 11; i++) {
        await request(app.getHttpServer())
          .post('/book')
          .set('Authorization', `Bearer ${token}`)
          .send(booksRequests[i])
          .expect(201);
      }

      // act & assert
      await request(app.getHttpServer())
        .get('/book?limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(function (res) {
          expect(res.body.length).toBeGreaterThanOrEqual(10);
        });
    });

    it('should return schema', async () => {
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
              edition: {
                type: 'string',
              },
              publicationYear: {
                type: 'integer',
              },
              authors: {
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
                    },
                    required: ['id', 'name'],
                  },
                ],
              },
            },
            required: ['id', 'name', 'edition', 'publicationYear', 'authors'],
          },
        ],
      };

      // act & assert
      await request(app.getHttpServer())
        .get('/book?limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(function (res) {
          expect(res.body).toMatchSchema(schema);
        });
    });
  });

  describe('/book/id (GET)', () => {
    it('should return created book', async () => {
      // arrange
      const authors = await createAuthors();
      const body = await new CreateBookRequestBuilder()
        .withDefaultConfigs()
        .withAuthors(authors)
        .build();

      let location = '';
      await request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .expect(201)
        .expect((res) => {
          location = res.headers.location.split(`${port}`)[1];
        });

      // act & assert
      await request(app.getHttpServer())
        .get(location)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('if not exists should return 404', async () => {
      // arrange
      const id = Faker.datatype.number({ min: 10000, max: 100000 });

      // act & assert
      await request(app.getHttpServer())
        .get(`/book/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should return schema', async () => {
      // arrange
      const schema = {
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
          authors: {
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
                },
                required: ['id', 'name'],
              },
            ],
          },
        },
        required: ['id', 'name', 'edition', 'publicationYear', 'authors'],
      };
      const authors = await createAuthors();
      const body = await new CreateBookRequestBuilder()
        .withDefaultConfigs()
        .withAuthors(authors)
        .build();

      let location = '';
      await request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .expect(201)
        .expect((res) => {
          location = res.headers.location.split(`${port}`)[1];
        });

      // act & assert
      await request(app.getHttpServer())
        .get(location)
        .expect(200)
        .set('Authorization', `Bearer ${token}`)
        .expect((res) => {
          expect(res.body).toMatchSchema(schema);
        });
    });
  });

  describe('/book/id (DELETE)', () => {
    it('should return 404 if book does not exists', async () => {
      // arrange
      const id = Faker.datatype.number({ min: 10000, max: 100000 });

      // act & assert
      await request(app.getHttpServer())
        .delete(`/book/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should return 204 if book exists', async () => {
      // arrange
      const authors = await createAuthors();
      const body = await new CreateBookRequestBuilder()
        .withDefaultConfigs()
        .withAuthors(authors)
        .build();

      let location = '';
      await request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .expect(201)
        .expect((res) => {
          location = res.headers.location.split(`${port}`)[1];
        });

      // act & assert
      await request(app.getHttpServer())
        .delete(location)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('should delete', async () => {
      // arrange
      const authors = await createAuthors();
      const body = await new CreateBookRequestBuilder()
        .withDefaultConfigs()
        .withAuthors(authors)
        .build();

      let location = '';
      await request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .expect(201)
        .expect((res) => {
          location = res.headers.location.split(`${port}`)[1];
        });

      // act
      await request(app.getHttpServer())
        .delete(location)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // assert
      await request(app.getHttpServer())
        .get(location)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/book/id (PATCH)', () => {
    it('should return 404 if book not exists', async () => {
      // arrange
      const id = Faker.datatype.number({ min: 10000, max: 100000 });

      // act & assert
      await request(app.getHttpServer())
        .patch(`/book/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should update data', async () => {
      // arrange
      const authors = await createAuthors();
      const postBody = await new CreateBookRequestBuilder()
        .withDefaultConfigs()
        .withAuthors(authors)
        .build();

      let location = '';
      const newAuthors = await createAuthors();

      await request(app.getHttpServer())
        .post('/book')
        .send(postBody)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect((res) => {
          location = res.headers.location.split(`${port}`)[1];
        });

      const chunks = location.split('/');
      const id = Number(chunks[chunks.length - 1]);

      const patchBody = await new UpdateBookRequestBuilder()
        .withBookId(id)
        .withAuthors(newAuthors)
        .build();

      // act
      await request(app.getHttpServer())
        .patch(location)
        .set('Authorization', `Bearer ${token}`)
        .send(patchBody)
        .expect((res) => {
          if (res.statusCode !== 200) console.log(res.body);
        })
        .expect(200);

      // assert
      await request(app.getHttpServer())
        .get(location)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(id);
          expect(res.body.name).toBe(patchBody.name);
          expect(res.body.publicationYear).toBe(patchBody.publicationYear);
          expect(res.body.edition).toBe(patchBody.edition);
        });
    });

    it('should return schema', async () => {
      // arrange
      const schema = {
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
      };
      const authors = await createAuthors();
      const postBody = await new CreateBookRequestBuilder()
        .withDefaultConfigs()
        .withAuthors(authors)
        .build();

      let location = '';
      await request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${token}`)
        .send(postBody)
        .expect(201)
        .expect((res) => {
          location = res.headers.location.split(`${port}`)[1];
        });

      const chunks = location.split('/');
      const id = Number(chunks[chunks.length - 1]);

      const patchBody = await new UpdateBookRequestBuilder()
        .withBookId(id)
        .withAuthors(authors)
        .build();

      // act & assert
      await request(app.getHttpServer())
        .patch(location)
        .set('Authorization', `Bearer ${token}`)
        .send(patchBody)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchSchema(schema);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
