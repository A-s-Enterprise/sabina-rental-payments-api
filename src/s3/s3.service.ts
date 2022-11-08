import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3_CLIENT } from '../constant';

@Injectable()
export class S3Service {
  private readonly BUCKET: string;
  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.BUCKET = this.configService.get('AWS_S3_BUCKET');
  }

  async delete(key: string, versionId: string): Promise<boolean> {
    const result = await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.BUCKET,
        Key: `assets/${key}`,
        VersionId: versionId,
      }),
    );

    return result?.DeleteMarker;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const result = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.BUCKET,
        Key: `assets/${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read-write',
        ContentType: file.mimetype,
        BucketKeyEnabled: false,
      }),
    );

    return this.createObjectUrl(file.originalname, result.VersionId);
  }

  createObjectUrl(key: string, versionId: string): string {
    return `${this.configService.get(
      'AWS_S3_URI',
    )}/${key}?versionId=${versionId}`;
  }
}
