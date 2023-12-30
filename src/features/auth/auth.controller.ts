import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() body: SignupDto) {
    return this.authService.signUp(body);
  }

  @Post('login')
  login() {
    return 'login';
  }
}
