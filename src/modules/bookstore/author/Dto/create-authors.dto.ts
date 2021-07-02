import { IsNotEmpty } from 'class-validator';

export class CreateAuthorRequest {
  @IsNotEmpty()
  name: string;
}

export interface CreateAuthorResponse {
  id: number;
  name: string;
}
