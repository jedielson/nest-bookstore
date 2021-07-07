import { ArrayNotEmpty } from 'class-validator';

export class UpdateBookRequest {
  id: number;
  name: string;
  edition: string;
  publicationYear: number;

  @ArrayNotEmpty({ message: 'you must inform at least one author' })
  author: number[];
}

export interface UpdateBookResponse {
  id: number;
  name: string;
  edition: string;
  publicationYear: number;
}
