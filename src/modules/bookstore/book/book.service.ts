import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { AUTHOR_REPOSITORY, BOOK_REPOSITORY } from 'src/core/constants';
import { Author } from '../author/author.entity';
import { Book } from './book.entity';
import { CreateBookRequest, CreateBookResponse } from './dto/create-book.dto';
import { GetBooksRequest, GetBooksResponse } from './dto/get-books.dto';

@Injectable()
export class BookService {
  constructor(
    @Inject(BOOK_REPOSITORY) private readonly bookRepository: typeof Book,
    @Inject(AUTHOR_REPOSITORY) private readonly authorRepository: typeof Author,
  ) {}

  async getAll(req: GetBooksRequest): Promise<GetBooksResponse[]> {
    const data = await this.bookRepository.findAndCountAll({
      offset: req.offset,
      limit: req.limit,
    });
    return data.rows.map((x) => {
      return {
        name: x.name,
        edition: x.edition,
        publicationYear: x.publicationYear,
      };
    });
  }

  async create(req: CreateBookRequest): Promise<CreateBookResponse> {
    const author = await this.authorRepository.findAll({
      where: {
        id: {
          [Op.in]: req.author,
        },
      },
    });

    if (!author || author.length == 0) {
      throw new NotFoundException('Authors does not exists');
    }

    if (author.length != req.author.length) {
      throw new UnprocessableEntityException();
    }

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
