import { BOOK_REPOSITORY } from 'src/core/constants';
import { Book } from './book.entity';

export const bookProviders = [
  {
    provide: BOOK_REPOSITORY,
    useValue: Book,
  },
];
