import { IsNotEmpty } from 'class-validator';

export class CreateAuthorRequest {
  @IsNotEmpty()
  name: string;
}

export class CreateAuthorResponse {
  constructor(readonly name: string) {}
}
