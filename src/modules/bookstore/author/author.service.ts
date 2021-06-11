import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { AUTHOR_REPOSITORY } from 'src/core/constants';
import { Author } from './author.entity';
import {
  CreateAuthorRequest,
  CreateAuthorResponse,
} from './dto/create-authors.dto';
import { GetAuthorsRequest, GetAutorsResponse } from './dto/get-authors.dto';

@Injectable()
export class AuthorService {
  constructor(
    @Inject(AUTHOR_REPOSITORY) private readonly authorRepository: typeof Author,
  ) {}

  async getAll(dto: GetAuthorsRequest): Promise<GetAutorsResponse[]> {
    const where = {};

    if (dto.name) {
      where['name'] = {
        [Op.like]: '%' + dto.name + '%',
      };
    }

    const data = await this.authorRepository.findAndCountAll({
      where: where,
      limit: dto.limit,
      offset: dto.offset,
    });

    return data.rows.map((x) => new GetAutorsResponse(x.name));
  }

  async create(req: CreateAuthorRequest): Promise<CreateAuthorResponse> {
    const data = await this.authorRepository.create<Author>({ name: req.name });
    return new CreateAuthorResponse(data.name);
  }
}
