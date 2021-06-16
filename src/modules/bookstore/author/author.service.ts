import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Author } from './author.entity';
import {
  CreateAuthorRequest,
  CreateAuthorResponse,
} from './dto/create-authors.dto';
import { GetAuthorsRequest, GetAutorsResponse } from './dto/get-authors.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async getAll(dto: GetAuthorsRequest): Promise<GetAutorsResponse[]> {
    const where = {};

    if (dto.name) {
      where['name'] = Like('%' + dto.name + '%');
    }

    const data = await this.authorRepository.findAndCount({
      where: where,
      take: dto.limit,
      skip: dto.offset,
    });

    return data[0].map((x) => new GetAutorsResponse(x.name));
  }

  async create(req: CreateAuthorRequest): Promise<CreateAuthorResponse> {
    const author = new Author();
    author.name = req.name;

    this.authorRepository.save(author);
    return new CreateAuthorResponse(author.name);
  }
}
