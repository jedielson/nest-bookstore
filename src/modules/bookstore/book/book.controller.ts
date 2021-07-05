import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookRequest } from './dto/create-book.dto';
import { GetBooksRequest } from './dto/get-books.dto';
import { UpdateBookRequest } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  getAll(@Query() req: GetBooksRequest) {
    return this.bookService.getAll(req);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.bookService.getOne(id);
  }

  @Post()
  create(@Body() req: CreateBookRequest) {
    return this.bookService.create(req);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() req: UpdateBookRequest) {
    req.id = id;
    return this.bookService.update(req);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookService.delete(id);
  }
}
