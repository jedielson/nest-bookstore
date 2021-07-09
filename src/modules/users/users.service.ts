import { Injectable } from '@nestjs/common';

import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: UserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id: id } });
  }
}
