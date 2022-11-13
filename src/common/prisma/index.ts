import { Prisma } from '@prisma/client';
import { hashPassword, omit } from '../utils';

const AppPrismaMiddleware: Prisma.Middleware = async (params, next) => {
  const isUserModel = params.model == 'User';

  if (isUserModel && params.action == 'create') {
    params.args.data.password = await hashPassword(params.args.data.password);
  }

  if (['update', 'updateMany'].includes(params.action)) {
    params.args.data.updatedAt = new Date();
  }

  const result = await next(params);

  if (isUserModel && result) {
    return Array.isArray(result)
      ? result.map((val) => omit(val, 'password'))
      : result;
  }

  return result;
};

export { AppPrismaMiddleware };
