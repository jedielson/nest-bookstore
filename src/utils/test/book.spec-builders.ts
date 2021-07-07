import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { UpdateBookRequest } from '../../modules/bookstore/book/dto/update-book.dto';
import { CreateBookRequest } from '../../modules/bookstore/book/dto/create-book.dto';
import { IBuilder } from './common/IBuilder';

export class CreateBookRequestBuilder
  implements IBuilder<CreateBookRequestBuilder, CreateBookRequest>
{
  private asyncFactory: Factory.Async.Factory<
    CreateBookRequest,
    keyof CreateBookRequest
  >;

  private transformFactory: Factory.Async.TransformFactory<
    CreateBookRequest,
    keyof CreateBookRequest,
    CreateBookRequest
  >;

  private authors: number[];

  withDefaultConfigs(): CreateBookRequestBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): CreateBookRequestBuilder {
    this.asyncFactory = Factory.Async.makeFactory<CreateBookRequest>(
      new CreateBookRequest(),
    );
    return this;
  }

  withAsyncTransform(): CreateBookRequestBuilder {
    this.setAuthors();

    this.transformFactory = this.asyncFactory.transform(
      (x: CreateBookRequest) => {
        x.name = Faker.name.findName();
        x.publicationYear = Faker.date.past().getFullYear();
        x.edition = Faker.datatype.string(10);
        x.author = this.authors;
        return x;
      },
    );
    return this;
  }

  private setAuthors(): void {
    if (this.authors && this.authors.length > 0) {
      return;
    }

    const length = Faker.datatype.number(10);
    this.authors = [];
    for (let i = 0; i < length; i++) {
      this.authors.push(Faker.datatype.number(100));
    }
  }

  withAuthors(authors: number[]): CreateBookRequestBuilder {
    this.authors = authors;
    return this;
  }

  build(): Promise<CreateBookRequest> {
    this.withDefaultConfigs();
    return this.transformFactory.build();
  }

  buildList(length: number): Promise<CreateBookRequest[]> {
    this.withDefaultConfigs();
    return this.transformFactory.buildList(length);
  }
}

export class UpdateBookRequestBuilder
  implements IBuilder<UpdateBookRequestBuilder, UpdateBookRequest>
{
  private authors: number[];
  private bookId: number;
  private asyncFactory: Factory.Async.Factory<
    UpdateBookRequest,
    keyof UpdateBookRequest
  >;
  private transformFactory: Factory.Async.TransformFactory<
    UpdateBookRequest,
    keyof UpdateBookRequest,
    UpdateBookRequest
  >;

  withDefaultConfigs(): UpdateBookRequestBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): UpdateBookRequestBuilder {
    this.asyncFactory = Factory.Async.makeFactory<UpdateBookRequest>(
      new UpdateBookRequest(),
    );
    return this;
  }

  withAsyncTransform(): UpdateBookRequestBuilder {
    this.setAuthors();
    this.setBookId();
    this.transformFactory = this.asyncFactory.transform(
      (x: UpdateBookRequest) => {
        x.id = this.bookId;
        x.name = Faker.name.findName();
        x.publicationYear = Faker.date.past().getFullYear();
        x.edition = Faker.datatype.string(10);
        x.author = this.authors;
        return x;
      },
    );
    return this;
  }

  private setBookId() {
    if (this.bookId > 0) return;
    throw Error('The book id is mandatory');
  }

  private setAuthors(): void {
    if (this.authors && this.authors.length > 0) {
      return;
    }

    const length = Faker.datatype.number(10);
    this.authors = [];
    for (let i = 0; i < length; i++) {
      this.authors.push(Faker.datatype.number(100));
    }
  }

  withBookId(id: number): UpdateBookRequestBuilder {
    this.bookId = id;
    return this;
  }

  withAuthors(authors: number[]): UpdateBookRequestBuilder {
    this.authors = authors;
    return this;
  }

  build(): Promise<UpdateBookRequest> {
    this.withDefaultConfigs();
    return this.transformFactory.build();
  }

  buildList(length: number): Promise<UpdateBookRequest[]> {
    this.withDefaultConfigs();
    return this.transformFactory.buildList(length);
  }
}
