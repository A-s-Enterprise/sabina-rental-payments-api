import { Module } from '@nestjs/common';
import { SearchHealthIndicator } from './search.health';
import { SearchService } from './search.service';
import ElasticConfig from '../elastic-index-configuration/elastic.config';

@Module({
  imports: [ElasticConfig],
  providers: [SearchService, SearchHealthIndicator],
  exports: [SearchService, SearchHealthIndicator],
})
export class SearchModule {}
