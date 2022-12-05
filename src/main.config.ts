import {
  INestApplication,
  VersioningType,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { EntityNotFoundFilter } from './common/filters/entity-not-found.filter';
import { RecordNotFoundFilter } from './common/filters/record-not-found.filter';

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
  app.useGlobalFilters(new EntityNotFoundFilter(), new RecordNotFoundFilter());

  if (config.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Sabina Rentals Payments API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
