import {
  INestApplication,
  VersioningType,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

export default (app: INestApplication, config: ConfigService) => {
  app.enableCors();
  app.setGlobalPrefix('/api/');
  app.enableVersioning({
    defaultVersion: config.get('API_VERSION'),
    type: VersioningType.URI,
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, skipMissingProperties: true }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
