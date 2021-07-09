import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Gender, User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserResponse, UserDto } from '../users/dto/user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    usersService.create = jest.fn().mockImplementationOnce(null);
    jwtService.decode = jest.fn().mockImplementationOnce(null);
    expect(service).toBeDefined();
  });

  it('validate user should return false if user does not exist', async () => {
    // arrange
    usersService.findOneByEmail = jest.fn().mockResolvedValueOnce(undefined);

    // act & assert
    await expect(service.validateUser(null, null)).resolves.toBeFalsy();
  });

  it('validate user should return false if password does not match', async () => {
    // arrange
    const user = new User();
    user.password = 'password';
    usersService.findOneByEmail = jest.fn().mockResolvedValueOnce(user);

    // act & assert
    await expect(
      service.validateUser('someuser', 'somepassword'),
    ).resolves.toBeFalsy();
  });

  it('validate user should return true if password match', async () => {
    // arrange
    const password = 'password';
    const user = new User();
    user.password = await bcrypt.hash(password, 10);
    usersService.findOneByEmail = jest.fn().mockResolvedValueOnce(user);

    // act & assert
    await expect(
      service.validateUser('someuser', password),
    ).resolves.toBeTruthy();
  });

  it('login should throw error if could not generate token', async () => {
    // arrange
    jwtService.signAsync = jest.fn().mockResolvedValueOnce(undefined);
    usersService.findOneByEmail = jest.fn().mockResolvedValueOnce(new User());

    // act & assert
    await expect(service.login('somelogin')).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('login should return token', async () => {
    // arrange
    jwtService.signAsync = jest.fn().mockResolvedValueOnce('some string');
    usersService.findOneByEmail = jest.fn().mockResolvedValueOnce(new User());

    // act & assert
    await expect(service.login('somelogin')).resolves.toBe('some string');
  });

  it('create should create new login', async () => {
    // arrange
    const token = 'sometoken';
    const userDto = new UserDto();
    userDto.email = 'a@b.com';
    userDto.name = 'Some Name';
    userDto.password = 'password';
    userDto.gender = Gender.MALE;

    const createdUser: CreateUserResponse = {
      user: {
        email: userDto.email,
        name: userDto.name,
      },
      token: token,
    };

    jwtService.signAsync = jest.fn().mockResolvedValueOnce(token);
    usersService.create = jest.fn().mockResolvedValueOnce(userDto);

    // act & assert
    await expect(service.create(userDto)).resolves.toStrictEqual(createdUser);
  });
});
