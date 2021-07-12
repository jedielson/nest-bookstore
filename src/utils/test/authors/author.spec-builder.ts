import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { Book } from '../../../modules/bookstore/book/book.entity';
import { Author } from '../../../modules/bookstore/author/author.entity';
import { IBuilder } from '../common/IBuilder';

export class AuthorBuilder implements IBuilder<AuthorBuilder, Author> {
  asyncFactory: Factory.Async.Factory<Author, keyof Author>;
  transformFactory: Factory.Async.TransformFactory<
    Author,
    keyof Author,
    Author
  >;
  books: Book[];

  withDefaultConfigs(): AuthorBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): AuthorBuilder {
    this.asyncFactory = Factory.Async.makeFactory<Author>(new Author());

    return this;
  }

  withAsyncTransform(): AuthorBuilder {
    const b = this.books;
    this.transformFactory = this.asyncFactory.transform((a: Author) => {
      a.name = Faker.name.findName(
        Faker.name.firstName(),
        Faker.name.lastName(),
      );

      a.books = b;
      return a;
    });

    return this;
  }

  withBooks(books: Book[]): AuthorBuilder {
    this.books = books;
    return this;
  }

  build(): Promise<Author> {
    return this.transformFactory.build();
  }

  async buildList(length: number): Promise<Author[]> {
    return this.transformFactory.buildList(length);
  }
}
