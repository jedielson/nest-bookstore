import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { GetAuthorsRequest } from '../../../modules/bookstore/author';
import { IBuilder } from '../common/IBuilder';

export class GetAuthorsRequestBuilder
  implements IBuilder<GetAuthorsRequestBuilder, GetAuthorsRequest>
{
  asyncFactory: Factory.Async.Factory<
    GetAuthorsRequest,
    keyof GetAuthorsRequest
  >;
  transformFactory: Factory.Async.TransformFactory<
    GetAuthorsRequest,
    keyof GetAuthorsRequest,
    GetAuthorsRequest
  >;

  withDefaultConfigs(): GetAuthorsRequestBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): GetAuthorsRequestBuilder {
    this.asyncFactory = Factory.Async.makeFactory<GetAuthorsRequest>(
      new GetAuthorsRequest(),
    );

    return this;
  }

  withAsyncTransform(): GetAuthorsRequestBuilder {
    this.transformFactory = this.asyncFactory.transform(
      (a: GetAuthorsRequest) => {
        a.name = Faker.name.findName(
          Faker.name.firstName(),
          Faker.name.lastName(),
        );

        return a;
      },
    );

    return this;
  }

  build(): Promise<GetAuthorsRequest> {
    return this.transformFactory.build();
  }

  buildList(length: number): Promise<GetAuthorsRequest[]> {
    return this.transformFactory.buildList(length);
  }
}
