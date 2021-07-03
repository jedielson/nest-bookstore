import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../author/author.entity';
import { BookRulesService } from './book-rules/book-rules.service';
import { Book } from './book.entity';
import { BookService } from './book.service';
import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { GetBooksRequest, GetBooksResponse } from './dto/get-books.dto';
import { Result } from '@badrap/result';
import { CreateBookRequest, CreateBookResponse } from './dto/create-book.dto';
import { UpdateBookRequest } from './dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Repository<Book>;
  let rules: BookRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Author),
          useClass: Repository,
        },
        {
          provide: BookRulesService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    rules = module.get<BookRulesService>(BookRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get books should call find and count', async () => {
    // arrange
    const getBooksRequestFactory = Factory.Sync.makeFactory<GetBooksRequest>(
      new GetBooksRequest(),
    );

    const getBooksResponseFactory = Factory.Sync.makeFactory<GetBooksResponse>({
      id: Factory.each((x) => x),
      edition: Faker.hacker.abbreviation(),
      name: Faker.name.findName(),
      publicationYear: 0,
    });

    const request = getBooksRequestFactory.build();
    const response = getBooksResponseFactory.buildList(10);
    bookRepository.findAndCount = jest
      .fn()
      .mockResolvedValueOnce([response, 0]);

    // act
    await service.getAll(request);

    // assert
    expect(bookRepository.findAndCount).toBeCalledTimes(1);
  });

  it('get books should call map data correctly', async () => {
    // arrange
    const getBooksRequestFactory = Factory.Sync.makeFactory<GetBooksRequest>(
      new GetBooksRequest(),
    );

    const getBooksResponseFactory = Factory.Async.makeFactory<Book>(
      new Book(),
    ).transform((x: Book) => {
      x.id = Faker.datatype.number();
      x.name = Faker.name.findName();
      x.edition = Faker.datatype.string(10);
      x.publicationYear = Faker.date.future().getFullYear();
      return x;
    });

    const request = getBooksRequestFactory.build();
    const response = await getBooksResponseFactory.buildList(10);
    bookRepository.findAndCount = jest
      .fn()
      .mockResolvedValueOnce([response, 0]);

    // act
    // assert
    await expect(service.getAll(request)).resolves.toStrictEqual(
      response.map((x) => {
        return {
          id: x.id,
          name: x.name,
          edition: x.edition,
          publicationYear: x.publicationYear,
        };
      }),
    );
  });

  it('create should validate if authors exists', async () => {
    // arrange
    bookRepository.create = jest.fn().mockResolvedValueOnce(new Book());
    const error = Error('Ronaldo');
    const result = Result.err(error);

    rules.authorsMustExist = jest.fn().mockResolvedValueOnce(result);

    // act
    // assert
    await expect(service.create(new CreateBookRequest())).rejects.toThrow(
      error,
    );
    expect(rules.authorsMustExist).toBeCalledTimes(1);
    expect(bookRepository.create).toBeCalledTimes(0);
  });

  it('create should call create', async () => {
    // arrange
    const createBooksRequestFactory =
      Factory.Async.makeFactory<CreateBookRequest>(
        new CreateBookRequest(),
      ).transform((x: CreateBookRequest) => {
        x.author = <number[]>Faker.datatype.array(10);
        x.name = Faker.name.findName();
        x.publicationYear = Faker.date.past().getFullYear();
        x.edition = Faker.datatype.string(10);
        return x;
      });
    const request = await createBooksRequestFactory.build();

    const book = new Book();
    book.edition = request.edition;
    book.name = request.name;
    book.publicationYear = request.publicationYear;

    bookRepository.save = jest.fn().mockResolvedValueOnce(book);
    const result = Result.ok(new Array<Author>());

    rules.authorsMustExist = jest.fn().mockResolvedValueOnce(result);

    // act
    await service.create(request);

    // assert
    expect(rules.authorsMustExist).toBeCalledTimes(1);
    expect(bookRepository.save).toBeCalledTimes(1);
  });

  it('create should return data correctly', async () => {
    // arrange
    const createBooksRequestFactory =
      Factory.Async.makeFactory<CreateBookRequest>(
        new CreateBookRequest(),
      ).transform((x: CreateBookRequest) => {
        x.author = <number[]>Faker.datatype.array(10);
        x.name = Faker.name.findName();
        x.publicationYear = Faker.date.past().getFullYear();
        x.edition = Faker.datatype.string(10);
        return x;
      });
    const request = await createBooksRequestFactory.build();
    const response: CreateBookResponse = {
      id: 1,
      edition: request.edition,
      name: request.name,
      publicationYear: request.publicationYear,
    };

    const book = new Book();
    book.id = 1;
    book.edition = request.edition;
    book.name = request.name;
    book.publicationYear = request.publicationYear;

    bookRepository.save = jest.fn().mockResolvedValueOnce(book);
    const result = Result.ok(new Array<Author>());

    rules.authorsMustExist = jest.fn().mockResolvedValueOnce(result);

    // act
    const a = await service.create(request);

    // assert
    expect(a).toStrictEqual(response);
  });

  it('update should validate if authors exists', async () => {
    // arrange
    bookRepository.update = jest.fn().mockResolvedValueOnce(new Book());
    bookRepository.findOne = jest.fn().mockResolvedValueOnce(new Book());
    const error = Error('Some error');
    const result = Result.err(error);

    rules.authorsMustExist = jest.fn().mockResolvedValueOnce(result);

    // act
    // assert
    await expect(service.update(new UpdateBookRequest())).rejects.toThrow(
      error,
    );
    expect(rules.authorsMustExist).toBeCalledTimes(1);
    expect(bookRepository.update).toBeCalledTimes(0);
  });

  it('update should call save', async () => {
    // arrange
    const updateBooksRequestFactory =
      Factory.Async.makeFactory<UpdateBookRequest>(
        new UpdateBookRequest(),
      ).transform((x: UpdateBookRequest) => {
        x.author = <number[]>Faker.datatype.array(10);
        x.name = Faker.name.findName();
        x.publicationYear = Faker.date.past().getFullYear();
        x.edition = Faker.datatype.string(10);
        return x;
      });
    const request = await updateBooksRequestFactory.build();

    const book = new Book();
    book.edition = request.edition;
    book.name = request.name;
    book.publicationYear = request.publicationYear;

    bookRepository.save = jest.fn().mockResolvedValueOnce(book);
    bookRepository.findOne = jest.fn().mockResolvedValueOnce(book);
    const result = Result.ok(new Array<Author>());

    rules.authorsMustExist = jest.fn().mockResolvedValueOnce(result);

    // act
    await service.update(request);

    // assert
    expect(rules.authorsMustExist).toBeCalledTimes(1);
    expect(bookRepository.save).toBeCalledTimes(1);
  });

  it('update should return correct data', async () => {
    // arrange
    const updateBooksRequestFactory =
      Factory.Async.makeFactory<UpdateBookRequest>(
        new UpdateBookRequest(),
      ).transform((x: UpdateBookRequest) => {
        x.id = Faker.datatype.number();
        x.author = <number[]>Faker.datatype.array(10);
        x.name = Faker.name.findName();
        x.publicationYear = Faker.date.past().getFullYear();
        x.edition = Faker.datatype.string(10);
        return x;
      });
    const request = await updateBooksRequestFactory.build();

    const book = new Book();
    book.id = request.id;

    bookRepository.save = jest.fn().mockResolvedValueOnce(request);
    bookRepository.findOne = jest.fn().mockResolvedValueOnce(book);
    const result = Result.ok(new Array<Author>());

    rules.authorsMustExist = jest.fn().mockResolvedValueOnce(result);

    // act
    const response = await service.update(request);

    // assert
    expect(response).toStrictEqual({
      id: request.id,
      edition: request.edition,
      name: request.name,
      publicationYear: request.publicationYear,
    });
  });

  it('delete should call remove', async () => {
    // arrange
    const id = Faker.datatype.number();
    bookRepository.remove = jest.fn();
    bookRepository.findOne = jest.fn().mockResolvedValueOnce(new Book());

    // act
    await service.delete(id);

    // assert
    expect(bookRepository.remove).toBeCalledTimes(1);
  });

  it('delete should validate if book exists', async () => {
    // arrange
    const id = Faker.datatype.number();
    bookRepository.findOne = jest.fn().mockResolvedValueOnce(undefined);

    // act
    // assert
    await expect(service.delete(id)).rejects.toThrow(NotFoundException);
  });
});
