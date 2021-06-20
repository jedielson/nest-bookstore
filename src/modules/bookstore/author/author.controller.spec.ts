import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { GetAuthorsRequest, GetAutorsResponse } from './dto/get-authors.dto';
import * as Factory from 'factory.ts';
import {
  CreateAuthorRequest,
  CreateAuthorResponse,
} from './dto/create-authors.dto';

import * as Faker from 'faker';

describe('AuthorController', () => {
  let controller: AuthorController;
  let service: AuthorService;
  let authorsRequestFactory: Factory.Sync.Factory<GetAuthorsRequest>;
  let authorResponseFactory: Factory.Sync.Factory<GetAutorsResponse>;
  let createAuthorRequestFactory: Factory.Sync.Factory<CreateAuthorRequest>;
  let createAuthorResponseFactory: Factory.Sync.Factory<CreateAuthorResponse>;

  beforeAll(() => {
    authorsRequestFactory = Factory.Sync.makeFactory<GetAuthorsRequest>(
      new GetAuthorsRequest(),
    );

    authorResponseFactory = Factory.Sync.makeFactory<GetAutorsResponse>({});

    const author = new CreateAuthorRequest();
    author.name = Faker.name.findName();
    createAuthorRequestFactory =
      Factory.Sync.makeFactory<CreateAuthorRequest>(author);

    createAuthorResponseFactory =
      Factory.Sync.makeFactory<CreateAuthorResponse>({
        name: '',
      });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthorService,
          useValue: {},
        },
      ],
      controllers: [AuthorController],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    controller = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all authors', async () => {
    // arrange
    const request = authorsRequestFactory.build();
    const response = authorResponseFactory.buildList(10);

    service.getAll = jest.fn().mockResolvedValueOnce(response);

    // act & assert
    await expect(controller.getAll(request)).resolves.toBe(response);
  });

  it('should return created author', async () => {
    // arrange
    const request = createAuthorRequestFactory.build();
    const response = createAuthorResponseFactory.build({ name: request.name });

    service.create = jest.fn().mockResolvedValueOnce(response);

    // act & assert
    await expect(controller.create(request)).resolves.toStrictEqual(response);
  });
});
