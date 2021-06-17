import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { AuthorService } from './author.service';
import { GetAuthorsRequest, GetAutorsResponse } from './dto/get-authors.dto';

describe('AuthorService', () => {
  let service: AuthorService;
  let mockRepository: Repository<Author>;

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
    jest
      .spyOn(mockRepository, 'findAndCount')
      .mockResolvedValueOnce([new Array<Author>(), 0]);

    // act
    const result = await service.getAll(new GetAuthorsRequest());

    // assert
    expect(result).toEqual(new Array<GetAutorsResponse>());
  });
});
