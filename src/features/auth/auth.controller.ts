import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Request, Response } from 'express';
import { Public } from './decorators/is-public.decorator';
import { RefreshGuard } from './guards/refresh.guard';
import { AppConstants } from 'src/core';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Public()
  signUp(@Body() body: SignupDto) {
    return this.authService.signUp(body);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      user,
      tokens: { accessToken, refreshToken },
    } = await this.authService.login(body);

    res.cookie(AppConstants.auth.refreshCookie, refreshToken, {
      expires: new Date(Date.now() + this.authService.expirationTime),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Cookie is accessible only through HTTPS
    });

    return { user, accessToken };
  }

  @Get('profile')
  profile(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    return this.authService.logout((req.user as any).id);
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      user,
      tokens: { accessToken, refreshToken },
    } = await this.authService.refresh(req.user as any);

    res.cookie(AppConstants.auth.refreshCookie, refreshToken, {
      expires: new Date(Date.now() + this.authService.expirationTime),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Cookie is accessible only through HTTPS
    });

    return { user, accessToken };
  }
}
