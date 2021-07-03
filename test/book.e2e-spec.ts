import { Test, TestingModule } from '@nestjs/testing';
import { matchers } from 'jest-json-schema';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as Faker from 'faker';
import { AppModule } from '../src/app.module';
import { CreateAuthorRequestBuilder } from '../src/utils/test/author.spec-builders';
import { CreateBookRequestBuilder } from '../src/utils/test/book.spec-builders';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    expect.extend(matchers);
    await app.init();
  });

  describe('/books (POST)', () => {
    const createAuthors = async (): Promise<number[]> => {
      const countAuthors = Faker.datatype.number({ min: 3, max: 5 });
      const authorsRequests = await new CreateAuthorRequestBuilder()
        .withDefaultConfigs()
        .buildList(countAuthors);

      const authors: number[] = [];

      for (let i = 0; i < countAuthors; i++) {
        await request(app.getHttpServer())
          .post('/author')
          .send(authorsRequests[i])
          .expect(201)
          .expect((res) => {
            if (res.statusCode === 201) authors.push(res.body.id);
          });
      }

      return authors;
    };

    it('should create a book', async () => {
      // arrange
      const authors = await createAuthors();
      const body = await new CreateBookRequestBuilder()
        .withAuthors(authors)
        .withDefaultConfigs()
        .build();

      // act & assert
      await request(app.getHttpServer())
        .post('/book')
        .send(body)
        .expect((res) => {
          if (res.statusCode === 201) return;

          console.log(body);
          console.log(res.body);
        })
        .expect(201);
    });

    // should return 400 if author invalid
    it('should return schema', async () => {
      // arrange
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema',
        $id: 'http://example.com/example.json',
        type: 'object',
        title: 'The root schema',
        description: 'The root schema comprises the entire JSON document.',
        default: {},
        examples: [
          {
            id: 10,
            name: 'Antonio Schinner PhD',
            edition: '$E2XV6oFP0',
            publicationYear: 2020,
          },
        ],
        required: ['id', 'name', 'edition', 'publicationYear'],
        properties: {
          id: {
            $id: '#/properties/id',
            type: 'integer',
            title: 'The id schema',
            description: 'An explanation about the purpose of this instance.',
            default: 0,
            examples: [10],
          },
          name: {
            $id: '#/properties/name',
            type: 'string',
            title: 'The name schema',
            description: 'An explanation about the purpose of this instance.',
            default: '',
            examples: ['Antonio Schinner PhD'],
          },
          edition: {
            $id: '#/properties/edition',
            type: 'string',
            title: 'The edition schema',
            description: 'An explanation about the purpose of this instance.',
            default: '',
            examples: ['$E2XV6oFP0'],
          },
          publicationYear: {
            $id: '#/properties/publicationYear',
            type: 'integer',
            title: 'The publicationYear schema',
            description: 'An explanation about the purpose of this instance.',
            default: 0,
            examples: [2020],
          },
        },
        additionalProperties: true,
      };
      const authors = await createAuthors();
      const body = await new CreateBookRequestBuilder()
        .withAuthors(authors)
        .withDefaultConfigs()
        .build();

      // act & assert
      await request(app.getHttpServer())
        .post('/book')
        .send(body)
        .expect((res) => {
          if (res.statusCode === 201) return;

          console.log(body);
          console.log(res.body);
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchSchema(schema);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});