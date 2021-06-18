import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../modules/users/user.entity';
import { UsersService } from '../../modules/users/users.service';
import { DoesUserExistGuard } from './does-user-exist.guard';

describe('DoesUserExistGuard', () => {
  let guard: DoesUserExistGuard;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoesUserExistGuard,
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    guard = module.get<DoesUserExistGuard>(DoesUserExistGuard);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(DoesUserExistGuard).toBeDefined();
  });

  it('should return forbidden when user already exist', async () => {
    // arrange
    service.findOneByEmail = jest.fn().mockResolvedValueOnce(new User());
    const req = {
      body: {
        email: 'some-email',
      },
    };

    // act
    // assert
    await expect(guard.validateRequest(req)).rejects.toThrowError(
      ForbiddenException,
    );
  });

  it('should return tre if does not exist an user with email', async () => {
    // arrange
    service.findOneByEmail = jest.fn().mockResolvedValueOnce(undefined);
    const req = {
      body: {
        email: 'some-email',
      },
    };

    // act
    // assert
    await expect(guard.validateRequest(req)).resolves.toBeTruthy();
  });
});
