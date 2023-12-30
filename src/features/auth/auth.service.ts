import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload } from './types/jwt-payload';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'src/config/auth.config';
import { RefreshPayload } from './types/refresh-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  get expirationTime() {
    return 7 * 24 * 60 * 60 * 1000;
  }

  private hash(token: string) {
    return bcrypt.hash(token, 10);
  }

  private async generateTokens(user: User) {
    const authConfig = this.config.get<AuthConfig>('auth');
    const payload: JwtPayload = { email: user.email, id: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: authConfig.jwtExpires,
      secret: authConfig.jwtSecret,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: authConfig.refreshExpires,
      secret: authConfig.refreshSecret,
    });

    return { accessToken, refreshToken };
  }

  private async generateAndSaveToken(user: User) {
    const tokens = await this.generateTokens(user);
    const hashedRt = await this.hash(tokens.refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        hashedRt,
      },
    });

    delete user.password;
    delete user.hashedRt;

    return { user, tokens };
  }

  async signUp(dto: SignupDto) {
    await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: await this.hash(dto.password),
      },
    });

    return true;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    const isValid = await bcrypt.compare(dto.password, user?.password || '');

    if (!isValid) {
      throw new BadRequestException({
        errors: { email: 'Invalid Credentials' },
      });
    }

    return this.generateAndSaveToken(user);
  }

  async logout(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: {
        hashedRt: null,
      },
    });

    return true;
  }

  async refresh(payload: RefreshPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    const isValid = await bcrypt.compare(
      payload.refreshToken,
      user?.hashedRt || '',
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateAndSaveToken(user);
  }
}
