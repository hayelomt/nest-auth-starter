import { AuthGuard } from '@nestjs/passport';
import { AppConstants } from 'src/core';

export class RefreshGuard extends AuthGuard(
  AppConstants.auth.refreshStrategy,
) {}
