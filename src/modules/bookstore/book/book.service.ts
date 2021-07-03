import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../author/author.entity';
import { BookRulesService } from './book-rules/book-rules.service';
import { Book } from './book.entity';
import { CreateBookRequest, CreateBookResponse } from './dto/create-book.dto';
import { GetBooksRequest, GetBooksResponse } from './dto/get-books.dto';
import { UpdateBookRequest, UpdateBookResponse } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private readonly bookRules: BookRulesService,
  ) {}

  async getAll(req: GetBooksRequest): Promise<GetBooksResponse[]> {
    const data = await this.bookRepository.findAndCount({
      skip: req.offset,
      take: req.limit,
    });
    return data[0].map((x) => {
      return {
        id: x.id,
        name: x.name,
        edition: x.edition,
        publicationYear: x.publicationYear,
      };
    });
  }

  async create(req: CreateBookRequest): Promise<CreateBookResponse> {
    const authorExists = await this.bookRules.authorsMustExist(req.author);
    const author = authorExists.unwrap();

    const data = await this.bookRepository.save({
      name: req.name,
      edition: req.edition,
      publicationYear: req.publicationYear,
      authors: author,
    });

    return {
      id: data.id,
      name: data.name,
      edition: data.edition,
      publicationYear: data.publicationYear,
    };
  }

  async update(req: UpdateBookRequest): Promise<UpdateBookResponse> {
    let book = await this.bookRepository.findOne(req.id);

    const authorExists = await this.bookRules.authorsMustExist(req.author);
    const author = authorExists.unwrap();

    book.publicationYear = req.publicationYear;
    book.edition = book.edition;
    book.name = book.name;
    book.authors = author;

    book = await this.bookRepository.save(book);

    return {
      id: book.id,
      edition: book.edition,
      name: book.name,
      publicationYear: book.publicationYear,
    };
  }

  async delete(id: number): Promise<void> {
    const book = await this.bookRepository.findOne(id);

    if (!book) {
      throw new NotFoundException();
    }

    await this.bookRepository.remove(book);
  }
}
