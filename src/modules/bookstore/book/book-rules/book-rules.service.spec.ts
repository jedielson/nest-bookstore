import { Test, TestingModule } from '@nestjs/testing';
import { BookRulesService } from './book-rules.service';

describe('BookRulesService', () => {
  let service: BookRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookRulesService],
    }).compile();

    service = module.get<BookRulesService>(BookRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
