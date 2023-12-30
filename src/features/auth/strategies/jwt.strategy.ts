import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from 'src/config/auth.config';
import { JwtPayload } from '../types/jwt-payload';
import { AppConstants } from 'src/core';
import { UserService } from 'src/features/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  AppConstants.auth.jwtStrategy,
) {
  constructor(
    config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<AuthConfig>('auth').jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.loadUser(payload.id);

    if (!user) {
      throw new UnauthorizedException('Account not found');
    }

    return user;
  }
}
