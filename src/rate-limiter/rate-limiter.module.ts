import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ThrottlerModule, ThrottlerModuleOptions } from "@nestjs/throttler";

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => {
        const isProd = configService.get('NODE_ENV') === 'production';
        // if development 150 requests with a window of 100 seconds
        return {
          limit: isProd ? configService.get('THROTTLE_LIMIT') : 100,
          ttl: isProd ? configService.get('THROTTLE_TTL') : 150,
          ignoreUserAgents: [
            /insomnia/gi
          ]
        }
      },
      inject: [ConfigService]
    })
  ]
})
export class RateLimiterModule {}