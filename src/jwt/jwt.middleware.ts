import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log(req.headers);

    if ('x-token' in req.headers) {
      const token = req.headers['x-token'];
      console.log(token);
    }
    next();
  }
}
