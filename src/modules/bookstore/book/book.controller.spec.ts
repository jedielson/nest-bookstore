import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import * as Factory from 'factory.ts';
import { GetBooksRequest, GetBooksResponse } from './dto/get-books.dto';
import * as Faker from 'faker';
import { CreateBookRequest, CreateBookResponse } from './dto/create-book.dto';
import { UpdateBookRequest } from './dto/update-book.dto';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BookService,
          useValue: {},
        },
      ],
      controllers: [BookController],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get all should call get all', async () => {
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
    service.getAll = jest.fn().mockResolvedValueOnce(response);

    // act
    await controller.getAll(request);

    //assert
    expect(service.getAll).toBeCalledTimes(1);
  });

  it('get one should return', async () => {
    // arrange
    const id = Faker.datatype.number();
    service.getOne = jest.fn().mockResolvedValueOnce({
      id: id,
      name: Faker.name.findName(),
      edition: Faker.hacker.abbreviation(),
      publicationYear: Faker.date.recent().getFullYear(),
    });

    // act
    await controller.getOne(id);

    //assert
    expect(service.getOne).toBeCalledTimes(1);
  });

  it('create book should call create', async () => {
    // arrange
    const createBooksRequestFactory =
      Factory.Sync.makeFactory<CreateBookRequest>(new CreateBookRequest());

    const createBooksResponseFactory =
      Factory.Sync.makeFactory<CreateBookResponse>({
        id: Faker.datatype.number(),
        edition: Faker.hacker.abbreviation(),
        name: Faker.name.findName(),
        publicationYear: 0,
      });

    const request = createBooksRequestFactory.build();
    const response = createBooksResponseFactory.build();
    service.create = jest.fn().mockResolvedValueOnce(response);

    // act
    await controller.create(request);

    // assert
    expect(service.create).toBeCalledTimes(1);
  });

  it('update should call update', async () => {
    // arrange
    const id = Faker.datatype.number();
    const updateBooksRequestFactory =
      Factory.Sync.makeFactory<UpdateBookRequest>(new UpdateBookRequest());

    const request = updateBooksRequestFactory.build();
    let receivedId = 0;
    service.update = jest.fn().mockImplementation((x: UpdateBookRequest) => {
      receivedId = x.id;
    });

    // act
    await controller.update(id, request);

    // assert
    expect(service.update).toBeCalledTimes(1);
    expect(receivedId).toBe(id);
  });

  it('delete should call delete', async () => {
    // arrange
    const id = Faker.datatype.number();
    service.delete = jest.fn();

    // act
    await controller.delete(id);

    // assert
    expect(service.delete).toBeCalledTimes(1);
  });
});
