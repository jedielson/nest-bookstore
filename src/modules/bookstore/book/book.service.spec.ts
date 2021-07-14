import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../author/author.entity';
import { BookRulesService } from './book-rules/book-rules.service';
import { Book } from './book.entity';
import { BookService } from './book.service';
import * as Faker from 'faker';
import { BookAuthors } from './dto/get-books.dto';
import { Result } from '@badrap/result';
import { CreateBookRequest, CreateBookResponse } from './dto/create-book.dto';
import { UpdateBookRequest } from './dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';
import {
  BookBuilder,
  CreateBookRequestBuilder,
  GetBookResponseBuilder,
  GetBooksRequestBuilder,
  UpdateBookRequestBuilder,
} from '../../../utils/test/books';
import { AuthorBuilder } from '../../../utils/test/authors';

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
    const authors = await new AuthorBuilder().withDefaultConfigs().buildList(3);
    const request = await new GetBooksRequestBuilder()
      .withDefaultConfigs()
      .build();
    const response = await new GetBookResponseBuilder()
      .withDefaultConfigs()
      .withAuthors(authors)
      .buildList(10);

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
    const authors = await new AuthorBuilder().withDefaultConfigs().buildList(3);
    const request = await new GetBooksRequestBuilder()
      .withDefaultConfigs()
      .build();
    const response = await new BookBuilder()
      .withDefaultConfigs()
      .withAuthors(authors)
      .buildList(10);

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
          authors: x.authors?.map(
            (a) =>
              <BookAuthors>{
                id: a.id,
                name: a.name,
              },
          ),
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
    const request = await new CreateBookRequestBuilder()
      .withDefaultConfigs()
      .build();

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
    const request = await new CreateBookRequestBuilder()
      .withDefaultConfigs()
      .build();
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
    const request = await new UpdateBookRequestBuilder()
      .withDefaultConfigs()
      .withBookId(1)
      .build();

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
    const request = await new UpdateBookRequestBuilder()
      .withDefaultConfigs()
      .withBookId(1)
      .build();

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
