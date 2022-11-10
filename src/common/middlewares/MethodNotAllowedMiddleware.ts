import { MethodNotAllowedException, NestMiddleware, RequestMethod } from "@nestjs/common";
import { Request, Response } from "express";
import { METHODS_ALLOWED } from "../../constant";

export class MethodNotAllowedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {

    if (!METHODS_ALLOWED.includes(req.method as keyof typeof RequestMethod)) {
      res.setHeader('Accept', METHODS_ALLOWED.join(','));
      return next(new MethodNotAllowedException());
    }

    next();
  }
}