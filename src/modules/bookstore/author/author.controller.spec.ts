import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController, AuthorService } from './';
import {
  CreateAuthorRequestBuilder,
  GetAuthorsRequestBuilder,
  GetAuthorsResponseBuilder,
  CreateAuthorResponseBuilder,
} from '../../../utils/test/authors';

describe('AuthorController', () => {
  let controller: AuthorController;
  let service: AuthorService;

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
    const request = await new GetAuthorsRequestBuilder()
      .withDefaultConfigs()
      .build();
    const response = await new GetAuthorsResponseBuilder()
      .withDefaultConfigs()
      .buildList(10);

    service.getAll = jest.fn().mockResolvedValueOnce(response);

    // act & assert
    await expect(controller.getAll(request)).resolves.toBe(response);
  });

  it('should return created author', async () => {
    // arrange
    const request = await new CreateAuthorRequestBuilder()
      .withDefaultConfigs()
      .build();
    const response = await new CreateAuthorResponseBuilder()
      .withDefaultConfigs()
      .build();

    service.create = jest.fn().mockResolvedValueOnce(response);

    // act & assert
    await expect(controller.create(request)).resolves.toStrictEqual(response);
  });
});
