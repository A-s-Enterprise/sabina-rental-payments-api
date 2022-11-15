import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../common/utils';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { REFRESH_TOKEN_EXPIRATION } from '../constant';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private client: Redis,
  ) {}

  async login({ userName, password }: LoginDto) {
    const user = await this.userService.findByUsername(userName);

    if (!user) {
      throw new BadRequestException('user does not exists.');
    }

    const isPasswordTheSame = await comparePassword(password, user.password);

    if (!isPasswordTheSame) {
      throw new BadRequestException('password provided is incorrect.');
    }

    return this.getAccessAndRefresh(user);
  }

  refresh(user) {
    return this.getAccessAndRefresh(user);
  }

  async getAccessAndRefresh({ id, userName }: User) {
    const data = { id, userName };

    const access_token = await this.jwtService.signAsync(data);

    const refresh_token = await this.jwtService.signAsync(data, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '1w',
    });

    await this.client.setex(id, REFRESH_TOKEN_EXPIRATION, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }
}
