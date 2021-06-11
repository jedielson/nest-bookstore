import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookRequest } from './dto/create-book.dto';
import { GetBooksRequest } from './dto/get-books.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  getAll(@Query() req: GetBooksRequest) {
    return this.bookService.getAll(req);
  }

  @Post()
  create(@Body() req: CreateBookRequest) {
    return this.bookService.create(req);
  }
}
