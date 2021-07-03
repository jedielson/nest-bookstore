import { ArrayNotEmpty } from 'class-validator';

export class CreateBookRequest {
  name: string;
  edition: string;
  publicationYear: number;

  @ArrayNotEmpty({ message: 'you must inform at least one author' })
  author: number[];
}

export interface CreateBookResponse {
  id: number;
  name: string;
  edition: string;
  publicationYear: number;
}
