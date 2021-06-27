import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListUsersUseCase } from './list-users.usecase';

import { HttpStatus } from '~shared/infra/http/enums';

export class ListUsersController {
  public async handle(
    httpRequest: Request,
    httpResponse: Response
  ): Promise<Response> {
    const listUsersUseCase = container.resolve(ListUsersUseCase);

    const users = await listUsersUseCase.execute();

    return httpResponse.status(HttpStatus.OK).json(users);
  }
}
