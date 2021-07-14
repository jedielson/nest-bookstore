import { Controller, Post, UseGuards, Body, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoesUserExistGuard } from '../../core/guards/does-user-exist.guard';
import { LoginDto, UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() req: LoginDto) {
    //console.log(req.body);
    return await this.authService.login(req.username);
  }

  @UseGuards(DoesUserExistGuard)
  @Post('signup')
  async signUp(@Body() user: UserDto) {
    return await this.authService.create(user);
  }
}
