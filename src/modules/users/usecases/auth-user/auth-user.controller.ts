import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthUserUseCase } from './auth-user.usecase';

export class AuthUserController {
  public async handle(
    httpRequest: Request,
    httpResponse: Response
  ): Promise<Response> {
    const { email, password } = httpRequest.body;

    const authUserUseCase = container.resolve(AuthUserUseCase);

    const session = await authUserUseCase.execute({ email, password });

    return httpResponse.status(200).json(session);
  }
}
