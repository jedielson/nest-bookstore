import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Author } from './author.entity';
import {
  CreateAuthorRequest,
  CreateAuthorResponse,
} from './dto/create-authors.dto';
import {
  AuthorBooks,
  GetAuthorsRequest,
  GetAuthorsResponse,
} from './dto/get-authors.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async getAll(dto: GetAuthorsRequest): Promise<GetAuthorsResponse[]> {
    const where = {};

    if (dto.name) {
      where['name'] = Like('%' + dto.name + '%');
    }

    const data = await this.authorRepository.findAndCount({
      where: where,
      take: dto.limit,
      skip: dto.offset,
      relations: ['books'],
    });

    return data[0].map((x) => {
      return {
        id: x.id,
        name: x.name,
        books: x.books?.map(
          (b) =>
            <AuthorBooks>{
              id: b.id,
              name: b.name,
              edition: b.edition,
              publicationYear: b.publicationYear,
            },
        ),
      };
    });
  }

  async find(id: number): Promise<GetAuthorsResponse> {
    const author = await this.authorRepository.findOne(id, {
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException();
    }

    return {
      id: author.id,
      name: author.name,
      books: author.books?.map(
        (b) =>
          <AuthorBooks>{
            id: b.id,
            name: b.name,
            edition: b.edition,
            publicationYear: b.publicationYear,
          },
      ),
    };
  }

  async create(req: CreateAuthorRequest): Promise<CreateAuthorResponse> {
    let author = new Author();
    author.name = req.name;

    author = await this.authorRepository.save(author);
    return {
      id: author.id,
      name: author.name,
    };
  }
}
