import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { CreateAuthorRequest } from '../../modules/bookstore/author/dto/create-authors.dto';

export class AuthorBuilder {
  buildCreateAuthorRequest(): Factory.Async.TransformFactory<
    CreateAuthorRequest,
    'name',
    CreateAuthorRequest
  > {
    return Factory.Async.makeFactory<CreateAuthorRequest>({
      name: '',
    }).transform((a: CreateAuthorRequest) => {
      a.name = Faker.name.findName(
        Faker.name.firstName(),
        Faker.name.lastName(),
      );
      return a;
    });
  }
}
