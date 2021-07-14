import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { Author } from '../../../modules/bookstore/author';
import {
  BookAuthors,
  GetBookResponse,
} from '../../../modules/bookstore/book/dto';
import { IBuilder } from '../common/IBuilder';

export class GetBookResponseBuilder
  implements IBuilder<GetBookResponseBuilder, GetBookResponse>
{
  asyncFactory: Factory.Async.Factory<GetBookResponse, keyof GetBookResponse>;
  transformFactory: Factory.Async.TransformFactory<
    GetBookResponse,
    keyof GetBookResponse,
    GetBookResponse
  >;
  authors: Author[];

  withDefaultConfigs(): GetBookResponseBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): GetBookResponseBuilder {
    this.asyncFactory = Factory.Async.makeFactory<GetBookResponse>({
      name: '',
      edition: '',
      publicationYear: 0,
      id: 0,
    });
    return this;
  }

  withAsyncTransform(): GetBookResponseBuilder {
    this.transformFactory = this.asyncFactory.transform(
      (a: GetBookResponse) => {
        a.name = Faker.name.findName(
          Faker.name.firstName(),
          Faker.name.lastName(),
        );
        a.edition = Faker.datatype.string(10);
        a.publicationYear = Faker.date.soon().getFullYear();
        a.authors = this.authors.map(
          (a) =>
            <BookAuthors>{
              id: a.id,
              name: a.name,
            },
        );
        return a;
      },
    );

    return this;
  }

  withAuthors(authors: Author[]): GetBookResponseBuilder {
    this.authors = authors;
    return this;
  }

  build(): Promise<GetBookResponse> {
    return this.transformFactory.build();
  }

  buildList(length: number): Promise<GetBookResponse[]> {
    return this.transformFactory.buildList(length);
  }
}
