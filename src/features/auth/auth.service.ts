import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private hash(token: string) {
    return bcrypt.hash(token, 10);
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
}
