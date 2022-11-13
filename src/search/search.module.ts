import { ClientOptions } from '@elastic/elasticsearch';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchHealthIndicator } from './search.health';
import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: (configService: ConfigService): ClientOptions => {
        return {
          nodes: configService.get('ELASTICSEARCH_NODE'),
          maxRetries: 3,
          requestTimeout: 1000,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService, SearchHealthIndicator],
  exports: [SearchService, SearchHealthIndicator],
})
export class SearchModule {}
