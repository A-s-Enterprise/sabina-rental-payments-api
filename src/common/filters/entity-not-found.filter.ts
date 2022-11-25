import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { NotFoundError } from '@prisma/client/runtime';
import { Response } from 'express';

@Catch(NotFoundError)
export class EntityNotFoundFilter<T> implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    return res.status(HttpStatus.NOT_FOUND).send({
      statusCode: HttpStatus.NOT_FOUND,
      message: `${exception.message}.`,
      error: 'Not Found.',
    });
  }
}
