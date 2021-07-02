import { Test, TestingModule } from '@nestjs/testing';
import { matchers } from 'jest-json-schema';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthorBuilder } from '../src/utils/test/author.spec.builders';

describe('AuthorsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    expect.extend(matchers);
    await app.init();
  });

  describe('/authors (POST)', () => {
    it('should create an author', async () => {
      // arrange
      const builder = new AuthorBuilder();
      const body = await builder.buildCreateAuthorRequest().build();

      // act & assert
      await request(app.getHttpServer())
        .post('/author')
        .send(body)
        .expect(201)
        .expect(function (res) {
          expect(res.body.id).toBeGreaterThan(0);
          expect(res.body.name).toBe(body.name);
        });
    });
  });

  describe('/authors (GET)', () => {
    beforeAll(async () => {
      const builder = new AuthorBuilder();
      const body = await builder.buildCreateAuthorRequest().buildList(11);

      const size = body.length;
      for (let index = 0; index < size; index++) {
        await request(app.getHttpServer())
          .post('/author')
          .send(body[index])
          .expect(201);
      }
    });

    it('should be paged', async () => {
      // arrange

      // act & assert
      await request(app.getHttpServer())
        .get('/author?limit=10')
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
            },
            required: ['id', 'name'],
          },
        ],
      };

      // act & assert
      await request(app.getHttpServer())
        .get('/author?limit=10')
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
