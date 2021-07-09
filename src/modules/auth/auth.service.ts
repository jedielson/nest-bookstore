import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserResponse, UserDto } from '../users/dto/user.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<boolean> {
    // find if user exist with this email
    const user = await this.userService.findOneByEmail(username);
    if (!user) {
      return false;
    }

    // find if user password match
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return false;
    }

    return true;
  }

  public async login(username: string): Promise<string> {
    const user = await this.userService.findOneByEmail(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const token = await this.generateToken(user);
    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }

  public async create(user: UserDto): Promise<CreateUserResponse> {
    // hash the password
    const pass = await this.hashPassword(user.password);

    // create the user
    const newUser = await this.userService.create({ ...user, password: pass });

    // generate token
    const token = await this.generateToken(newUser);

    // return the user and the token
    return {
      user: {
        name: newUser.name,
        email: newUser.email,
      },
      token,
    };
  }

  private async generateToken(user: User): Promise<string> {
    const token = await this.jwtService.signAsync({
      name: user.name,
      email: user.email,
      gender: user.gender,
    });
    return token;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
