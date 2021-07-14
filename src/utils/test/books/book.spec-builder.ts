import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { Author } from 'src/modules/bookstore/author';
import { Book } from '../../../modules/bookstore/book/book.entity';
import { IBuilder } from '../common/IBuilder';

export class BookBuilder implements IBuilder<BookBuilder, Book> {
  asyncFactory: Factory.Async.Factory<Book, keyof Book>;
  transformFactory: Factory.Async.TransformFactory<Book, keyof Book, Book>;
  authors: Author[];

  withDefaultConfigs(): BookBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): BookBuilder {
    this.asyncFactory = Factory.Async.makeFactory<Book>(new Book());
    return this;
  }

  withAsyncTransform(): BookBuilder {
    this.transformFactory = this.asyncFactory.transform((a: Book) => {
      a.name = Faker.name.findName(
        Faker.name.firstName(),
        Faker.name.lastName(),
      );
      a.edition = Faker.datatype.string(10);
      a.publicationYear = Faker.date.soon().getFullYear();
      a.authors = this.authors;
      return a;
    });

    return this;
  }

  withAuthors(authors: Author[]): BookBuilder {
    this.authors = authors;
    return this;
  }

  build(): Promise<Book> {
    return this.transformFactory.build();
  }

  buildList(length: number): Promise<Book[]> {
    return this.transformFactory.buildList(length);
  }
}
