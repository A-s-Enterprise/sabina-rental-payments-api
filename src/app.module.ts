import { Module } from '@nestjs/common';
import { S3Module } from './s3/s3.module';
import { ConfigurationModule } from './config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [ConfigurationModule, S3Module],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
