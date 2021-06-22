import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AddUserUseCase } from './add-user.usecase';

import { HttpStatus } from '~shared/infra/http/enums';

export class AddUserController {
  public async handle(httpRequest: Request, httpResponse: Response): Promise<Response> {
    const { name, email, admin } = httpRequest.body;

    const addUserUseCase = container.resolve(AddUserUseCase);

    const user = await addUserUseCase.execute({ name, email, admin });

    return httpResponse.status(HttpStatus.CREATED).json(user);
  }
}
