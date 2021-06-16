import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Author } from '../../author/author.entity';
import { Book } from '../book.entity';
import { Result } from '@badrap/result';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookRulesService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async authorsMustExist(authors: number[]): Promise<Result<Author[], Error>> {
    if (!authors || authors.length == 0) {
      console.log('here');
      return Result.err(
        new BadRequestException('You LOL must inform an author'),
      );
    }

    const data = await this.authorRepository.findByIds(authors);

    if (!data || data.length == 0) {
      return Result.err(new NotFoundException('Authors does not exists'));
    }

    if (data.length != authors.length) {
      return Result.err(new UnprocessableEntityException());
    }

    return Result.ok(data);
  }
}
