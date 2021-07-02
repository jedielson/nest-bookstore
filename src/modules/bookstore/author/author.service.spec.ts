import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Factory from 'factory.ts';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { AuthorService } from './author.service';
import { CreateAuthorRequest } from './dto/create-authors.dto';
import { GetAuthorsRequest, GetAutorsResponse } from './dto/get-authors.dto';
import * as Faker from 'faker';

describe('AuthorService', () => {
  let service: AuthorService;
  let mockRepository: Repository<Author>;

  let authorsFactory: Factory.Async.TransformFactory<Author, any, Author>;
  let authorsRequestFactory: Factory.Async.TransformFactory<
    GetAuthorsRequest,
    any,
    GetAuthorsRequest
  >;
  let createAuthorRequestFactory: Factory.Sync.Factory<CreateAuthorRequest>;

  beforeAll(() => {
    const authors = Factory.Async.makeFactory<Author>(new Author());
    authorsFactory = authors.transform((a: Author) => {
      a.name = Faker.name.findName();
      return a;
    });

    const getAuthorsRequest = Factory.Async.makeFactory<GetAuthorsRequest>(
      new GetAuthorsRequest(),
    );
    authorsRequestFactory = getAuthorsRequest.transform(
      (r: GetAuthorsRequest) => {
        r.name = Faker.name.findName();
        return r;
      },
    );

    const author = new CreateAuthorRequest();
    author.name = Faker.name.findName();
    createAuthorRequestFactory =
      Factory.Sync.makeFactory<CreateAuthorRequest>(author);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          //useValue: mockRepository,
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
    const request = await authorsRequestFactory.build();
    const authors = await authorsFactory.buildList(10);
    jest
      .spyOn(mockRepository, 'findAndCount')
      .mockResolvedValueOnce([authors, 0]);

    // act
    const result = await service.getAll(request);

    // assert
    const expected = authors.map<GetAutorsResponse>((x) => {
      const a: GetAutorsResponse = {
        name: x.name,
      };
      return a;
    });
    expect(result).toStrictEqual(expected);
  });

  it('create should return the author', async () => {
    // arrange
    const request = createAuthorRequestFactory.build();
    const author = new Author();
    author.id = 1;
    author.name = request.name;
    jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(author);

    // act & assert
    await expect(service.create(request)).resolves.toStrictEqual({
      id: 1,
      name: request.name,
    });
  });

  it('create should call save', async () => {
    // arrange
    const request = createAuthorRequestFactory.build();
    const mockCreate = jest
      .spyOn(mockRepository, 'save')
      .mockResolvedValueOnce(new Author());

    // act
    await service.create(request);

    //assert
    expect(mockCreate).toBeCalledTimes(1);
  });
});
