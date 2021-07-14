import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { GetBooksRequest } from '../../../modules/bookstore/book/dto';
import { IBuilder } from '../common/IBuilder';

export class GetBooksRequestBuilder
  implements IBuilder<GetBooksRequestBuilder, GetBooksRequest>
{
  asyncFactory: Factory.Async.Factory<GetBooksRequest, keyof GetBooksRequest>;
  transformFactory: Factory.Async.TransformFactory<
    GetBooksRequest,
    keyof GetBooksRequest,
    GetBooksRequest
  >;

  withDefaultConfigs(): GetBooksRequestBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): GetBooksRequestBuilder {
    this.asyncFactory = Factory.Async.makeFactory<GetBooksRequest>(
      new GetBooksRequest(),
    );
    return this;
  }

  withAsyncTransform(): GetBooksRequestBuilder {
    this.transformFactory = this.asyncFactory.transform(
      (a: GetBooksRequest) => {
        a.limit = Faker.datatype.number({ min: 0, max: 10 });
        return a;
      },
    );

    return this;
  }

  build(): Promise<GetBooksRequest> {
    return this.transformFactory.build();
  }

  buildList(length: number): Promise<GetBooksRequest[]> {
    return this.transformFactory.buildList(length);
  }
}
