import { PartialType } from '@nestjs/mapped-types';
import { ArrayNotEmpty } from 'class-validator';
import { CreateBookRequest } from './create-book.dto';

export class UpdateBookRequest extends PartialType(CreateBookRequest) {
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
