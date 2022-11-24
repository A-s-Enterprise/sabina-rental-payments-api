import { Prisma } from '@prisma/client';
import { hashPassword, omit } from '../utils';
import { BadRequestException } from '@nestjs/common';

const AppPrismaMiddleware: Prisma.Middleware = async (params, next) => {
  const { model, action, args } = params;

  const isUserModel = model == 'User';

  if (isUserModel && action == 'create') {
    params.args.data.password = await hashPassword(args.data.password);
  }

  if (['update', 'updateMany'].includes(action)) {
    params.args.data.updatedAt = new Date();
  }

  // before `action` operation is executed
  const result = await next(params);
  // after  `action` operation is executed

  // if entity does not exists
  if (action === 'findUnique' && !result) {
    throw new BadRequestException(`${model.toLowerCase()} does not exist.`);
  }

  if (isUserModel && result) {
    return Array.isArray(result)
      ? result.map((val) => omit(val, 'password'))
      : result;
  }

  return result;
};

export { AppPrismaMiddleware };
