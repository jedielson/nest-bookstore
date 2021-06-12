import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AUTHOR_REPOSITORY, BOOK_REPOSITORY } from 'src/core/constants';
import { Author } from '../../author/author.entity';
import { Book } from '../book.entity';
import { Result } from '@badrap/result';
import { Op } from 'sequelize';

@Injectable()
export class BookRulesService {
  constructor(
    @Inject(BOOK_REPOSITORY) private readonly bookRepository: typeof Book,
    @Inject(AUTHOR_REPOSITORY) private readonly authorRepository: typeof Author,
  ) {}

  async authorsMustExist(authors: number[]): Promise<Result<Author[], Error>> {
    if (!authors || authors.length == 0) {
      console.log('here');
      return Result.err(
        new BadRequestException('You LOL must inform an author'),
      );
    }

    const data = await this.authorRepository.findAll({
      where: {
        id: {
          [Op.in]: authors,
        },
      },
    });

    if (!data || data.length == 0) {
      return Result.err(new NotFoundException('Authors does not exists'));
    }

    if (data.length != authors.length) {
      return Result.err(new UnprocessableEntityException());
    }

    return Result.ok(data);
  }
}
