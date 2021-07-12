import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { GetAuthorsResponse } from '../../../modules/bookstore/author';
import { IBuilder } from '../common/IBuilder';

export class GetAuthorsResponseBuilder
  implements IBuilder<GetAuthorsResponseBuilder, GetAuthorsResponse>
{
  asyncFactory: Factory.Async.Factory<
    GetAuthorsResponse,
    keyof GetAuthorsResponse
  >;

  transformFactory: Factory.Async.TransformFactory<
    GetAuthorsResponse,
    keyof GetAuthorsResponse,
    GetAuthorsResponse
  >;

  withDefaultConfigs(): GetAuthorsResponseBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): GetAuthorsResponseBuilder {
    this.asyncFactory = Factory.Async.makeFactory<GetAuthorsResponse>({});
    return this;
  }

  withAsyncTransform(): GetAuthorsResponseBuilder {
    this.transformFactory = this.asyncFactory.transform(
      (a: GetAuthorsResponse) => {
        a.name = Faker.name.findName(
          Faker.name.firstName(),
          Faker.name.lastName(),
        );

        return a;
      },
    );

    return this;
  }

  build(): Promise<GetAuthorsResponse> {
    return this.transformFactory.build();
  }

  buildList(length: number): Promise<GetAuthorsResponse[]> {
    return this.transformFactory.buildList(length);
  }
}
