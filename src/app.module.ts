import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MethodNotAllowedMiddleware } from './common/middlewares/MethodNotAllowedMiddleware';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './db/database.module';
import { HealthModule } from './health/health.module';
import { RateLimiterGuard } from './rate-limiter/rate-limiter.guard';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { S3Module } from './s3/s3.module';
import { SearchModule } from './search/search.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CacheModule } from './cache/cache.module';
import { FloorModule } from './floor/floor.module';
import { RoomModule } from './room/room.module';
import { RoomTypeModule } from './room-type/room-type.module';

@Module({
  imports: [
    ConfigurationModule,
    RateLimiterModule,
    CacheModule,
    S3Module,
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,
    SearchModule,
    AuthModule,
    UserModule,
    FloorModule,
    RoomModule,
    RoomTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService, RateLimiterGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MethodNotAllowedMiddleware).forRoutes('*');
  }
}
