import { IndicesPutIndexTemplateIndexTemplateMapping } from '@elastic/elasticsearch/lib/api/types';
import { User } from '@prisma/client';

type UserTokenData = Pick<User, 'id' | 'userName'>;

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface IndexTemplate {
  name: string;
  body: {
    template: IndicesPutIndexTemplateIndexTemplateMapping | any;
    index_patterns: string[];
    priority: number;
  };
}

export { UserTokenData, AuthTokens, IndexTemplate };
