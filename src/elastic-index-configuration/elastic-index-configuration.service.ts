import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as indexTemplates from './index-template.json';
import * as indexMappings from './mappings.json';
import { isDeepStrictEqual } from 'util';
import { IndexTemplate, omit } from '../common/utils';
import { IndicesIndexState } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticConfigurationService implements OnApplicationBootstrap {
  constructor(private readonly elasticService: ElasticsearchService) {}

  async onApplicationBootstrap() {
    // create `index templates` that don't exist
    await Promise.all(
      indexTemplates.map(this.createIndexTemplateIfNotExists.bind(this)),
    );

    await Promise.all(
      Object.keys(indexMappings).map(async (index) => {
        const configIndexDetails = indexMappings[index];
        // create `indices` that don't exist
        const existingIndexDetails = await this.createIndexIfNotExists(
          index,
          configIndexDetails,
        );

        await this.updateIndexMappingsIfNotTheSame(
          index,
          existingIndexDetails,
          configIndexDetails,
        );

        await this.updateIndexAliasesIfNotTheSame(
          index,
          existingIndexDetails,
          configIndexDetails,
        );

        return existingIndexDetails;
      }),
    );
  }

  private async createIndexTemplateIfNotExists(
    indexTemplateConfig: IndexTemplate,
  ) {
    const {
      name,
      body: { index_patterns, priority, template },
    } = indexTemplateConfig;

    const indexTemplateResp = await this.elasticService.indices
      .getIndexTemplate({
        name,
      })
      .catch(() => false); // will return a 404 error if the index template does not exist

    if (!indexTemplateResp) {
      await this.elasticService.indices.putIndexTemplate({
        name,
        priority,
        index_patterns,
        template,
      });
    }

    return indexTemplateResp;
  }

  private async createIndexIfNotExists(
    index: string,
    configIndexDetails: any,
  ): Promise<IndicesIndexState> {
    const doesIndexExists = await this.elasticService.indices
      .get({
        index,
      })
      .catch(() => false); // will return a 404 error if the index does not exist

    if (!doesIndexExists) {
      await this.elasticService.indices.create({
        index,
        ...configIndexDetails,
      });
    }

    return doesIndexExists[index];
  }

  private async updateIndexMappingsIfNotTheSame(
    index: string,
    indexDetails: IndicesIndexState,
    configIndexDetails: any,
  ) {
    // remove inherited fields from `index templates`
    const existingMappingProperties = omit(
      indexDetails.mappings?.properties,
      'created_at',
      'updated_at',
    );

    const isConfigMappingsEqualToExistingMappings = isDeepStrictEqual(
      existingMappingProperties,
      configIndexDetails?.mappings?.properties,
    );

    if (!isConfigMappingsEqualToExistingMappings) {
      await this.elasticService.indices.putMapping({
        index,
        properties: configIndexDetails?.mappings?.properties,
      });
    }

    return;
  }

  private async updateIndexAliasesIfNotTheSame(
    index: string,
    indexDetails: IndicesIndexState,
    configIndexDetails: any,
  ): Promise<void> {
    const isConfigAliasesEqualToExistingAliases = isDeepStrictEqual(
      indexDetails?.aliases,
      configIndexDetails?.aliases,
    );

    if (!isConfigAliasesEqualToExistingAliases) {
      await Promise.all(
        Object.keys(configIndexDetails?.aliases).map((name) => {
          return this.elasticService.indices.putAlias({
            index,
            name,
          });
        }),
      );
    }

    return;
  }
}
