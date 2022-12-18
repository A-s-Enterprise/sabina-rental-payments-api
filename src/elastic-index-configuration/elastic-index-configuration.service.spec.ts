import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';
import { ElasticConfigurationService } from './elastic-index-configuration.service';

describe('ElasticService', () => {
  let service: ElasticConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticConfigurationService,
        {
          provide: ElasticsearchService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ElasticConfigurationService>(
      ElasticConfigurationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
