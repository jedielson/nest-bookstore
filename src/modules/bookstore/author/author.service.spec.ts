import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author, AuthorService, AuthorBooks } from './';
import * as Faker from 'faker';
import {
  AuthorBuilder,
  CreateAuthorRequestBuilder,
  GetAuthorsRequestBuilder,
} from '../../../utils/test/authors';
import { BookBuilder } from '../../../utils/test/books';

describe('AuthorService', () => {
  let service: AuthorService;
  let mockRepository: Repository<Author>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    mockRepository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all', async () => {
    // arrange
    const request = await new GetAuthorsRequestBuilder()
      .withDefaultConfigs()
      .build();
    const books = await new BookBuilder()
      .withDefaultConfigs()
      .buildList(Faker.datatype.number({ min: 2, max: 6 }));
    const authors = await new AuthorBuilder()
      .withBooks(books)
      .withDefaultConfigs()
      .buildList(10);
    mockRepository.findAndCount = jest.fn().mockResolvedValueOnce([authors, 0]);

    // act
    const result = await service.getAll(request);

    // assert
    const expected = authors.map((x) => {
      const a = {
        id: x.id,
        name: x.name,
        books: x.books.map(
          (b) =>
            <AuthorBooks>{
              id: b.id,
              name: b.name,
              edition: b.edition,
              publicationYear: b.publicationYear,
            },
        ),
      };
      return a;
    });
    expect(result).toStrictEqual(expected);
  });

  it('create should return the author', async () => {
    // arrange
    const request = await new CreateAuthorRequestBuilder()
      .withDefaultConfigs()
      .build();
    const author = await new AuthorBuilder().withDefaultConfigs().build();
    jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(author);

    // act & assert
    await expect(service.create(request)).resolves.toStrictEqual({
      id: author.id,
      name: author.name,
    });
  });

  it('create should call save', async () => {
    // arrange
    const request = await new CreateAuthorRequestBuilder()
      .withDefaultConfigs()
      .build();
    const mockCreate = jest
      .spyOn(mockRepository, 'save')
      .mockResolvedValueOnce(new Author());

    // act
    await service.create(request);

    //assert
    expect(mockCreate).toBeCalledTimes(1);
  });
});
