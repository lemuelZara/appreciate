import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';
import { BadRequestException } from '~shared/errors/http-errors';

@injectable()
export class EnsureAdminMiddleware {
  constructor(
    @inject('UserRepository') private userRepository: UserRepositoryProtocols
  ) {}

  public async handle(
    httpRequest: Request,
    httpResponse: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = httpRequest.user;

    const user = await this.userRepository.findById(id);

    if (!user?.admin) {
      throw new BadRequestException('User is not admin!');
    }

    return next();
  }
}
