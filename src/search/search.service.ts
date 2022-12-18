import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticService: ElasticsearchService) {}

  getClusterHealth() {
    return this.elasticService.cluster.health();
  }

  async search(): Promise<void> {
    // todo later
  }

  async deleteById(index: string, id: string): Promise<boolean> {
    const result = await this.elasticService.deleteByQuery({
      index,
      query: {
        term: {
          id,
        },
      },
    });

    return !!result.deleted;
  }

  async findById<T = any>(index: string, id: string): Promise<T> {
    const {
      hits: { hits },
    } = await this.elasticService.search<T>({
      index,
      query: {
        term: {
          id,
        },
      },
    });

    if (!hits?.length) return null;

    const [{ _source }] = hits;

    return _source;
  }

  async index<T = any>(index: string, data: T) {
    const { result } = await this.elasticService.index({
      index,
      ...data,
    });

    return result === 'created';
  }
}
