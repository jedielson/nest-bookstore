import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocationInterceptor } from '../../../core/http/location.interceptor';
import { BookService } from './book.service';
import { CreateBookRequest } from './dto/create-book.dto';
import { GetBooksRequest } from './dto/get-books.dto';
import { UpdateBookRequest } from './dto/update-book.dto';

@UseGuards(AuthGuard('jwt'))
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

  @UseInterceptors(LocationInterceptor)
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
  @HttpCode(204)
  delete(@Param('id') id: number) {
    return this.bookService.delete(id);
  }
}
