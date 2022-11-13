import { Injectable, Logger } from '@nestjs/common';
import {
  HealthIndicator,
  HealthCheckError,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { SearchService } from './search.service';

@Injectable()
export class SearchHealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(SearchHealthIndicator.name);

  constructor(private readonly searchService: SearchService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const {
        status,
        active_primary_shards,
        active_shards,
        relocating_shards,
      } = await this.searchService.getClusterHealth();

      return this.getStatus(
        'elasticsearch',
        ['yellow', 'green'].includes(status),
        {
          status,
          active_primary_shards,
          active_shards,
          relocating_shards,
        },
      );
    } catch (e) {
      throw new HealthCheckError(
        'Something went wrong with the elastic search cluster connection. Please check the logs for more details`',
        e.message,
      );
    }
  }
}
