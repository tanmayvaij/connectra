import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/common/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) user: User) {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body(ValidationPipe) user: User) {
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verify(@Request() req) {
    return req.user;
  }
}
