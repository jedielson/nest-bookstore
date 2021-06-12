import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { AUTHOR_REPOSITORY, BOOK_REPOSITORY } from 'src/core/constants';
import { Author } from '../author/author.entity';
import { BookRulesService } from './book-rules/book-rules.service';
import { Book } from './book.entity';
import { CreateBookRequest, CreateBookResponse } from './dto/create-book.dto';
import { GetBooksRequest, GetBooksResponse } from './dto/get-books.dto';
import { UpdateBookRequest, UpdateBookResponse } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @Inject(BOOK_REPOSITORY) private readonly bookRepository: typeof Book,
    @Inject(AUTHOR_REPOSITORY) private readonly authorRepository: typeof Author,
    private readonly bookRules: BookRulesService,
  ) {}

  async getAll(req: GetBooksRequest): Promise<GetBooksResponse[]> {
    const data = await this.bookRepository.findAndCountAll({
      offset: req.offset,
      limit: req.limit,
    });
    return data.rows.map((x) => {
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

    const data = await this.bookRepository.create<Book>({
      name: req.name,
      edition: req.edition,
      publicationYear: req.publicationYear,
      authors: author,
    });

    return {
      name: data.name,
      edition: data.edition,
      publicationYear: data.publicationYear,
    };
  }

  async update(req: UpdateBookRequest): Promise<UpdateBookResponse> {
    const book = await this.bookRepository.findByPk(req.id);

    const authorExists = await this.bookRules.authorsMustExist(req.author);
    const author = authorExists.unwrap();

    book.publicationYear = req.publicationYear;
    book.edition = book.edition;
    book.name = book.name;
    book.authors = author;

    const lol = await this.bookRepository.update(book, {
      where: {
        id: {
          [Op.eq]: req.id,
        },
      },
    });

    console.log(lol);

    return {
      id: req.id,
      edition: book.edition,
      name: book.name,
      publicationYear: book.publicationYear,
    };
  }

  async delete(id: number): Promise<number> {
    const book = await this.bookRepository.findByPk(id);

    if (!book) {
      throw new NotFoundException();
    }

    return this.bookRepository.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
  }
}
