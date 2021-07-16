import { Test, TestingModule } from '@nestjs/testing';
import { DoesUserExistGuard } from '../../core/guards/does-user-exist.guard';
import { CreateUserResponse, LoginDto, UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: DoesUserExistGuard,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should return a user', async () => {
    // arrange
    service.login = jest.fn().mockResolvedValueOnce('some return');

    // act & assert
    await expect(controller.login(new LoginDto())).resolves.toBe('some return');
  });

  it('signup should return a user', async () => {
    // arrange
    const userResponse: CreateUserResponse = {
      user: {
        name: 'some-name',
        email: 'a@b.com',
      },
      token: 'some token',
    };
    service.create = jest.fn().mockResolvedValueOnce(userResponse);

    // act & assert
    await expect(controller.signUp(new UserDto())).resolves.toBe(userResponse);
  });
});
