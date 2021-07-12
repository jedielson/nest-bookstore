import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { CreateAuthorResponse } from '../../../modules/bookstore/author';
import { IBuilder } from '../common/IBuilder';

export class CreateAuthorResponseBuilder
  implements IBuilder<CreateAuthorResponseBuilder, CreateAuthorResponse>
{
  asyncFactory: Factory.Async.Factory<
    CreateAuthorResponse,
    keyof CreateAuthorResponse
  >;
  transformFactory: Factory.Async.TransformFactory<
    CreateAuthorResponse,
    keyof CreateAuthorResponse,
    CreateAuthorResponse
  >;

  withDefaultConfigs(): CreateAuthorResponseBuilder {
    this.withAsyncFactory().withAsyncTransform();
    return this;
  }

  withAsyncFactory(): CreateAuthorResponseBuilder {
    this.asyncFactory = Factory.Async.makeFactory<CreateAuthorResponse>({
      id: Faker.datatype.number(),
      name: Faker.datatype.string(10),
    });
    return this;
  }

  withAsyncTransform(): CreateAuthorResponseBuilder {
    this.transformFactory = this.asyncFactory.transform(
      (a: CreateAuthorResponse) => {
        a.name = Faker.name.findName(
          Faker.name.firstName(),
          Faker.name.lastName(),
        );

        return a;
      },
    );

    return this;
  }

  build(): Promise<CreateAuthorResponse> {
    return this.transformFactory.build();
  }

  buildList(length: number): Promise<CreateAuthorResponse[]> {
    return this.transformFactory.buildList(length);
  }
}
