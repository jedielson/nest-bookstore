import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorRequest } from './dto/create-authors.dto';
import { GetAuthorsRequest } from './dto/get-authors.dto';

@Controller('author')
export class AuthorController {
  constructor(private authService: AuthorService) {}

  @Get()
  getAll(@Query() req: GetAuthorsRequest) {
    return this.authService.getAll(req);
  }

  @Post()
  create(@Body() req: CreateAuthorRequest) {
    return this.authService.create(req);
  }
}
