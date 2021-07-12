import { Type } from 'class-transformer';

export class GetAuthorsRequest {
  name?: string;

  @Type(() => Number)
  offset: number;

  @Type(() => Number)
  limit: number;
}

export interface AuthorBooks {
  id: number;
  name: string;
  edition: string;
  publicationYear: number;
}

export interface GetAuthorsResponse {
  id?: number;
  name?: string;
  books?: AuthorBooks[];
}
