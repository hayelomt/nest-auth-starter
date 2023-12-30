import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AuthConfig } from 'src/config/auth.config';
import { AppConstants } from 'src/core';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  AppConstants.auth.refreshStrategy,
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => req.cookies?.refresh || null,
      ignoreExpiration: false,
      secretOrKey: config.get<AuthConfig>('auth').refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refresh;

    if (!refreshToken)
      throw new UnauthorizedException('refresh token not found');

    return {
      ...payload,
      refreshToken,
    };
  }
}
