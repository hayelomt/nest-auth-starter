import { JwtPayload } from './jwt-payload';

export type RefreshPayload = JwtPayload & {
  refreshToken: string;
};
