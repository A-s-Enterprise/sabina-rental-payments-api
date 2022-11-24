import { User } from '@prisma/client';

type UserTokenData = Pick<User, 'id' | 'userName'>;

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export { UserTokenData, AuthTokens };
