import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from 'src/config/auth.config';
import { AppConstants } from 'src/core';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  AppConstants.auth.refreshStrategy,
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: (req) => req.cookies?.Refresh,
      ignoreExpiration: false,
      secretOrKey: config.get<AuthConfig>('auth').refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.headers.authorization.split(' ')[1];

    if (!refreshToken)
      throw new UnauthorizedException('refresh token not found');

    return {
      ...payload,
      refreshToken,
    };
  }
}
