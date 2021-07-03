import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Author } from '../../author/author.entity';
import { Result } from '@badrap/result';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookRulesService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async authorsMustExist(authors: number[]): Promise<Result<Author[], Error>> {
    if (!authors || authors.length == 0) {
      return Result.err(new BadRequestException('You must inform an author'));
    }

    const data = await this.authorRepository.findByIds(authors);

    if (!data || data.length == 0) {
      return Result.err(new NotFoundException('Authors does not exists'));
    }

    if (data.length != authors.length) {
      return Result.err(
        new UnprocessableEntityException('Not all authors were found'),
      );
    }

    return Result.ok(data);
  }
}
