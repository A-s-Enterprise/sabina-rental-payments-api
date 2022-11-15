import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @InjectRedis() private client: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refresh_token = request.headers['refresh_token'] as string;

    if (!refresh_token) return false;

    const user = await this.jwtService
      .verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET,
      })
      .catch(() => false);

    if (!user) return false;

    const whitelistedRefreshToken = await this.client.get(user.id);

    if (!whitelistedRefreshToken || whitelistedRefreshToken !== refresh_token)
      return false;

    request.user = user;

    return true;
  }
}
