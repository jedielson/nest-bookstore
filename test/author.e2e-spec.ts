import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateAuthorRequest } from '../src/modules/bookstore/author/dto/create-authors.dto';

describe('AuthorsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // describe('/authors (POST)', () => {

  // });

  it('should create an author', async () => {
    // arrange
    const body = new CreateAuthorRequest();
    body.name = 'Ronaldo';

    // act & assert
    await request(app.getHttpServer())
      .post('/author')
      .send(body)
      .expect(function (res) {
        expect(1).toEqual(1);
        console.log(res.headers);
      })
      .expect(201);
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer()).get('/author').expect(200); //.expect([]);
  });

  afterAll(async () => {
    await app.close();
  });
});
