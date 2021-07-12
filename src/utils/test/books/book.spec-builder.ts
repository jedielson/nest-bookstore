import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { Book } from '../../../modules/bookstore/book/book.entity';
import { IBuilder } from '../common/IBuilder';

export class BookBuilder implements IBuilder<BookBuilder, Book> {
  asyncFactory: Factory.Async.Factory<Book, keyof Book>;
  transformFactory: Factory.Async.TransformFactory<Book, keyof Book, Book>;

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
      return a;
    });

    return this;
  }

  async build(): Promise<Book> {
    this.withDefaultConfigs();
    return await this.transformFactory.build();
  }

  async buildList(length: number): Promise<Book[]> {
    this.withDefaultConfigs();
    return await this.transformFactory.buildList(length);
  }
}
