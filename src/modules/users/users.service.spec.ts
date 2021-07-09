import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import * as Factory from 'factory.ts';
import * as Faker from 'faker';
import { UserDto } from './dto/user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call create', async () => {
    // arrange
    const userDto = Factory.Sync.makeFactory<UserDto>(new UserDto()).build();
    userRepository.save = jest.fn();

    // act
    await service.create(userDto);

    // assert
    expect(userRepository.save).toBeCalledTimes(1);
  });

  it('findOneByEmail should call findOne', async () => {
    // arrange
    const email = Faker.random.alphaNumeric(10);
    userRepository.findOne = jest.fn();

    // act
    await service.findOneByEmail(email);

    // assert
    expect(userRepository.findOne).toBeCalledTimes(1);
  });

  it('FindOneById should call findOne', async () => {
    // arrange
    const id = Faker.datatype.number();
    userRepository.findOne = jest.fn();

    // act
    await service.findOneById(id);

    // assert
    expect(userRepository.findOne).toBeCalledTimes(1);
  });
});
