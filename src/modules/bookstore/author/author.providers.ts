import { AUTHOR_REPOSITORY } from 'src/core/constants';
import { Author } from './author.entity';

export const authorProviders = [
  {
    provide: AUTHOR_REPOSITORY,
    useValue: Author,
  },
];
