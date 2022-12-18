import { Module } from '@nestjs/common';
import { ElasticConfigurationService } from './elastic-index-configuration.service';
import ElasticModule from './elastic.config';

@Module({
  imports: [ElasticModule],
  exports: [],
  providers: [ElasticConfigurationService],
})
export class ElasticIndexConfigurationModule {}
