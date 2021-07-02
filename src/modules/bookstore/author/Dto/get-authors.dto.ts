import { Type } from 'class-transformer';

export class GetAuthorsRequest {
  name?: string;

  @Type(() => Number)
  offset: number;

  @Type(() => Number)
  limit: number;
}

export interface GetAutorsResponse {
  id?: number;
  name?: string;
}
