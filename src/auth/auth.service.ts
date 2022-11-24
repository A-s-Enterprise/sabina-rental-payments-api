import Redis from 'ioredis';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTokens, comparePassword, UserTokenData } from '../common/utils';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { REFRESH_TOKEN_EXPIRATION } from '../constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private client: Redis,
  ) {}

  async login({ userName, password }: LoginDto): Promise<AuthTokens> {
    const user = await this.userService.findByUsername(userName);

    const isPasswordTheSame = await comparePassword(password, user?.password);

    if (!isPasswordTheSame) {
      throw new BadRequestException('password provided is incorrect.');
    }

    return this.getAccessAndRefresh(user);
  }

  refresh(user: UserTokenData): Promise<AuthTokens> {
    return this.getAccessAndRefresh(user);
  }

  async getAccessAndRefresh({
    id,
    userName,
  }: UserTokenData): Promise<AuthTokens> {
    const data = { id, userName };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(data),
      this.jwtService.signAsync(data, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '1w',
      }),
    ]);

    await this.client.setex(id, REFRESH_TOKEN_EXPIRATION, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }
}
