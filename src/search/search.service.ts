import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticService: ElasticsearchService) {}

  getClusterHealth() {
    return this.elasticService.cluster.health();
  }
}
