import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtService: JwtStrategy;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: {},
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  it('should unauthorize if no user', async () => {
    // arrange
    usersService.findOneByEmail = jest.fn().mockResolvedValueOnce(undefined);

    // act & assert
    await expect(jwtService.validate({})).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should return same payload it authenticated', async () => {
    // arrange
    usersService.findOneByEmail = jest
      .fn()
      .mockResolvedValueOnce({ name: 'some user', id: 1 });

    const user = {
      id: 1,
      name: 'some name',
    };

    // act & assert
    await expect(jwtService.validate(user)).resolves.toBe(user);
  });
});
