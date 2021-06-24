/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AuthorController } from './author/author.controller';
import { BookController } from './book/book.controller';
import { AuthorService } from './author/author.service';
import { BookService } from './book/book.service';
import { BookRulesService } from './book/book-rules/book-rules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book/book.entity';
import { Author } from './author/author.entity';

@Module({
  controllers: [AuthorController, BookController],
  providers: [AuthorService, BookService, BookRulesService],
  exports: [AuthorService, BookService],
  imports: [TypeOrmModule.forFeature([Book, Author])],
})
export class BookstoreModule {}
