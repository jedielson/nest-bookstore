import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { CreateAuthorRequest } from '../../../modules/bookstore/author/dto/create-authors.dto';
import { IBuilder } from '../common/IBuilder';

export class CreateAuthorRequestBuilder
  implements IBuilder<CreateAuthorRequestBuilder, CreateAuthorRequest>
{
  asyncFactory: Factory.Async.Factory<CreateAuthorRequest, 'name'>;
  transformFactory: Factory.Async.TransformFactory<
    CreateAuthorRequest,
    'name',
    CreateAuthorRequest
  >;

  withDefaultConfigs(): CreateAuthorRequestBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): CreateAuthorRequestBuilder {
    this.asyncFactory = Factory.Async.makeFactory<CreateAuthorRequest>(
      new CreateAuthorRequest(),
    );

    return this;
  }

  withAsyncTransform(): CreateAuthorRequestBuilder {
    this.transformFactory = this.asyncFactory.transform(
      (a: CreateAuthorRequest) => {
        a.name = Faker.name.findName(
          Faker.name.firstName(),
          Faker.name.lastName(),
        );

        return a;
      },
    );

    return this;
  }

  build(): Promise<CreateAuthorRequest> {
    return this.transformFactory.build();
  }

  buildList(length: number): Promise<CreateAuthorRequest[]> {
    return this.transformFactory.buildList(length);
  }
}
