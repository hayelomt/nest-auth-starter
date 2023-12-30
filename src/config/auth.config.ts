import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES,
  refreshSecret: process.env.REFRESH_SECRET,
  refreshExpires: process.env.REFRESH_EXPIRES,
}));

export type AuthConfig = ReturnType<typeof authConfig>;
