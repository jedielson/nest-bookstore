import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { UpdateBookRequest } from '../../../modules/bookstore/book/dto';
import { IBuilder } from '../common/IBuilder';

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
