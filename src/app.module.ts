import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MethodNotAllowedMiddleware } from './common/middlewares/MethodNotAllowedMiddleware';
import { PrismaService } from './common/prisma.service';
import { ConfigurationModule } from './config/config.module';
import { RateLimiterGuard } from './rate-limiter/rate-limiter.guard';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigurationModule,
    RateLimiterModule,
    S3Module,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RateLimiterGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MethodNotAllowedMiddleware).forRoutes('*');
  }
}
