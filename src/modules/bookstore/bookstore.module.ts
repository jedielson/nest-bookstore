import { Module } from '@nestjs/common';
import { AuthorController } from './author/author.controller';
import { BookController } from './book/book.controller';
import { AuthorService } from './author/author.service';
import { BookService } from './book/book.service';
import { authorProviders } from './author/author.providers';
import { bookProviders } from './book/book.providers';

@Module({
  controllers: [AuthorController, BookController],
  providers: [AuthorService, BookService, ...authorProviders, ...bookProviders],
  exports: [AuthorService, BookService],
})
export class BookstoreModule {}
