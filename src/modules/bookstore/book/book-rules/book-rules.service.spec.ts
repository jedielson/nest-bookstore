import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../../author/author.entity';
import { Book } from '../book.entity';
import { BookRulesService } from './book-rules.service';

describe('BookRulesService', () => {
  let service: BookRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRulesService,
        {
          provide: getRepositoryToken(Book),
          useValue: Repository,
        },
        {
          provide: getRepositoryToken(Author),
          useValue: Repository,
        },
      ],
    }).compile();

    service = module.get<BookRulesService>(BookRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
