import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatus } from '~shared/infra/http/enums';

import { ListUserReceiveComplimentsUseCase } from './list-user-receive-compliments.usecase';

export class ListUserReceiveComplimentsController {
  public async handle(
    httpRequest: Request,
    httpResponse: Response
  ): Promise<Response> {
    const { id: userSenderId } = httpRequest.user;

    const listUserReceiveComplimentsUseCase = container.resolve(
      ListUserReceiveComplimentsUseCase
    );

    const compliments = await listUserReceiveComplimentsUseCase.execute({
      userId: userSenderId
    });

    return httpResponse.status(HttpStatus.OK).json(compliments);
  }
}
