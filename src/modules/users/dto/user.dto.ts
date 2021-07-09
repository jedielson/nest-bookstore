import { IsNotEmpty, MinLength, IsEmail, IsEnum } from 'class-validator';
import { Gender } from '../user.entity';

export class UserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: 'gender must be either male or female',
  })
  gender: Gender;
}

export class LoginDto {
  username: string;
  password: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface CreateUserResponse {
  user: CreateUserDto;
  token: string;
}
