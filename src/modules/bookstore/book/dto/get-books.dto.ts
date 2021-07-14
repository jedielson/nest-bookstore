import { Type } from 'class-transformer';
import { IsPositive, Min, Max } from 'class-validator';

export class GetBooksRequest {
  @Type(() => Number)
  @Min(0)
  offset: number;

  @Type(() => Number)
  @IsPositive()
  @Max(100)
  limit: number;
}

export interface BookAuthors {
  id: number;
  name: string;
}

export interface GetBookResponse {
  id: number;
  name: string;
  edition: string;
  publicationYear: number;
  authors?: BookAuthors[];
}
