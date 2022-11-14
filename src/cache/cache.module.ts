import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          readyLog: true,
          config: {
            url: `${configService.get('REDIS_HOST')}:${configService.get(
              'REDIS_PORT',
            )}`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class CacheModule {}
