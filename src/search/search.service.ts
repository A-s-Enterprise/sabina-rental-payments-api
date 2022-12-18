import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as indexTemplates from './index-template.json';
import * as indexMappings from './mappings.json';
import {
  IndicesGetIndexTemplateResponse,
  IndicesGetResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { isDeepStrictEqual } from 'util';
import { IndexTemplate, omit } from '../common/utils';

@Injectable()
export class SearchService implements OnModuleInit {
  constructor(private readonly elasticService: ElasticsearchService) {}

  async onModuleInit() {
    await Promise.all(
      indexTemplates.map(async (indexTemplate: IndexTemplate) => {
        const {
          name,
          body: { index_patterns, priority, template },
        } = indexTemplate;

        const existingIndexTemplate = await this.elasticService.indices
          .getIndexTemplate({
            name,
          })
          .catch((e) => {
            // will return a 404 error if the index template does not exist
            return false;
          });

        // check if the `index template` does not exist
        if (!existingIndexTemplate) {
          // then create the index template
          return this.elasticService.indices.putIndexTemplate({
            name,
            priority,
            index_patterns,
            template,
          });
        }

        const [{ index_template }] =
          (existingIndexTemplate as IndicesGetIndexTemplateResponse)
            ?.index_templates ?? [];

        const isCurrentMappingsEqualToOldMappings = isDeepStrictEqual(
          index_template.template.mappings,
          template.mappings,
        );

        if (!isCurrentMappingsEqualToOldMappings) {
          // then update the index template
          return this.elasticService.indices.putIndexTemplate({
            name,
            priority,
            index_patterns,
            template,
          });
        }

        return existingIndexTemplate;
      }),
    );

    await Promise.all(
      Object.keys(indexMappings).map(async (index) => {
        const doesIndexExists = await this.elasticService.indices
          .get({
            index,
          })
          .catch((e) => {
            // will return a 404 error if the index does not exist
            return false;
          });

        const currentIndexProps = indexMappings[index];

        // check if the `index` does not exist
        if (!doesIndexExists) {
          // then create the index
          return this.elasticService.indices.create({
            index,
            ...currentIndexProps,
          });
        }

        const indexDetails = doesIndexExists as IndicesGetResponse;

        // remove inherited fields from `index templates`
        const existingMappingProperties = omit(
          indexDetails[index].mappings?.properties,
          'created_at',
          'updated_at',
        );

        const isConfigMappingsEqualToExistingMappings = isDeepStrictEqual(
          existingMappingProperties,
          currentIndexProps?.mappings?.properties,
        );

        const isConfigAliasesEqualToExistingAliases = isDeepStrictEqual(
          indexDetails[index]?.aliases,
          currentIndexProps?.aliases,
        );

        // check if existing mappings is different from config `mappings`
        if (!isConfigMappingsEqualToExistingMappings) {
          await this.elasticService.indices.putMapping({
            index,
            properties: currentIndexProps?.mappings?.properties,
          });
        }

        // check if existing aliases is different from config `aliases`
        if (!isConfigAliasesEqualToExistingAliases) {
          await Promise.all(
            Object.keys(currentIndexProps?.aliases).map((name) => {
              return this.elasticService.indices.putAlias({
                index,
                name,
              });
            }),
          );
        }

        return doesIndexExists;
      }),
    );
  }

  // initialize indices and in their mappings on 'onModuleInit'

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
