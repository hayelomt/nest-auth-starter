import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AppConstants } from 'src/core';

@Injectable()
export class JwtGuard extends AuthGuard(AppConstants.auth.jwtStrategy) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AppConstants.auth.isPublic,
      [context.getHandler(), context.getClass()],
    );

    return isPublic || super.canActivate(context);
  }
}
