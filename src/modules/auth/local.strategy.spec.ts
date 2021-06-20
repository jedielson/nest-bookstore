import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {},
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  it('should unauthorize if no user', async () => {
    // arrange
    authService.validateUser = jest.fn().mockResolvedValueOnce(false);

    // act & assert
    await expect(localStrategy.validate('', '')).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should return true authenticated', async () => {
    // arrange
    authService.validateUser = jest.fn().mockResolvedValueOnce(true);

    // act & assert
    await expect(
      localStrategy.validate('user', 'password'),
    ).resolves.toBeTruthy();
  });
});
