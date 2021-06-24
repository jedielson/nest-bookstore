import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../../author/author.entity';
import { Book } from '../book.entity';
import { BookRulesService } from './book-rules.service';
import * as Faker from 'faker';
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('BookRulesService', () => {
  let service: BookRulesService;
  let authorRepository: Repository<Author>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRulesService,
        {
          provide: getRepositoryToken(Book),
          useValue: Repository,
        },
        {
          provide: getRepositoryToken(Author),
          useValue: Repository,
        },
      ],
    }).compile();

    service = module.get<BookRulesService>(BookRulesService);
    authorRepository = module.get<Repository<Author>>(
      getRepositoryToken(Author),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('if no authors should return BadRequest', async () => {
    // arrange
    const data: number[] = [];

    // act
    const result = await service.authorsMustExist(data);

    // assert
    expect(result.isErr).toBeTruthy();
    expect(() => result.unwrap()).toThrow(BadRequestException);
  });

  it('if found none authors should return NotFound', async () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = new Array<number>(Faker.datatype.number()).map((x) =>
      Faker.datatype.number(),
    );
    authorRepository.findByIds = jest.fn().mockReturnValueOnce([]);

    // act
    const result = await service.authorsMustExist(data);

    // assert
    expect(result.isErr).toBeTruthy();
    expect(() => result.unwrap()).toThrow(NotFoundException);
  });

  it('if found authors not same of passed authors should return UnprocessableEntity', async () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = new Array<number>(10).map((x) => Faker.datatype.number());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = new Array<number>(data.length).map((x) =>
      Faker.datatype.number(),
    );
    response.push(10);

    authorRepository.findByIds = jest.fn().mockReturnValueOnce(response);

    // act
    const result = await service.authorsMustExist(data);

    // assert
    expect(result.isErr).toBeTruthy();
    expect(() => result.unwrap()).toThrow(UnprocessableEntityException);
  });

  it('should return found authors', async () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = new Array<number>(10).map((x) => Faker.datatype.number());
    const authors = data.map((x) => {
      const a = new Author();
      a.id = x;
      a.name = Faker.name.findName();
      return a;
    });

    authorRepository.findByIds = jest.fn().mockReturnValueOnce(authors);

    // act
    const result = await service.authorsMustExist(data);

    // assert
    expect(result.unwrap()).toStrictEqual(authors);
  });
});
