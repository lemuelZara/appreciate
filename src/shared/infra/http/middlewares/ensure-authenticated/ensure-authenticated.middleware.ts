import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';

import { JWTProtocols } from '~shared/container/providers/jwt/protocols';
import { UnauthorizedException } from '~shared/errors/http-errors';

import auth from '~config/auth';

@injectable()
export class EnsureAuthenticatedMiddleware {
  constructor(@inject('JWTProvider') private jwtProvider: JWTProtocols) {}

  public async handle(
    httpRequest: Request,
    httpResponse: Response,
    next: NextFunction
  ): Promise<void> {
    const authHeader = httpRequest.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authentication token is missing!');
    }

    const [, token] = authHeader.split(' ');

    try {
      const { sub: userId } = this.jwtProvider.decodeToken(
        token,
        auth.publicKey
      );

      /* eslint no-param-reassign: "off" */
      httpRequest.user = {
        id: userId
      };

      return next();
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid authentication token, please log in a new session.'
      );
    }
  }
}
