import { Prisma } from '@prisma/client';
import { hashPassword, omit } from '../utils';
import { BadRequestException, HttpException } from '@nestjs/common';

const beforeActionMiddleware: Prisma.Middleware = async (params, next) => {
  const { model, action, args } = params;

  const result = await next(params);

  // the below code executes after `afterActionMiddleware`
  return result;
};

const afterActionMiddleware: Prisma.Middleware = async (params, next) => {
  const { model, action } = params;

  const result = await next(params);

  // the below code executes before
  // `await next(params)` in `beforeActionMiddleware`

  if (model === 'User' && result) {
    return Array.isArray(result)
      ? result.map((val) => omit(val, 'password'))
      : result;
  }

  return result;
};

export { beforeActionMiddleware, afterActionMiddleware };
