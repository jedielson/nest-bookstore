import { IsNotEmpty } from 'class-validator';

export class CreateAuthorRequest {
  @IsNotEmpty()
  name: string;
}

export interface CreateAuthorResponse {
  name: string;
}
