import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (_: any, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<Request>()?.user ?? null,
);
