import { ClientOptions } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

// `cloud` property issue
// put in a different file so we can reuse it in `search` module
export default ElasticsearchModule.registerAsync({
  useFactory: (configService: ConfigService): ClientOptions => {
    return {
      nodes: configService.get('ELASTICSEARCH_NODE'),
      maxRetries: 3,
      requestTimeout: 1000,
    };
  },
  inject: [ConfigService],
});
