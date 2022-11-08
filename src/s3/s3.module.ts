import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3_CLIENT } from '../constant';
import { S3Service } from './s3.service';

@Module({
  exports: [S3Service],
  providers: [
    {
      provide: S3_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get('AWS_REGION'),
          maxAttempts: 3,
        });
      },
      inject: [ConfigService],
    },
    ConfigService,
    S3Service,
  ],
})
export class S3Module {}
