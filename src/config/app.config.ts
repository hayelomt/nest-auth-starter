import { registerAs } from '@nestjs/config';

export const configuration = registerAs('app', () => ({
  env: process.env.NODE_ENV as 'development' | 'production' | 'test',
  port: parseInt(process.env.PORT, 10),
  databaseUrl: process.env.DATABASE_URL,
}));

export type AppConfig = ReturnType<typeof configuration>;
