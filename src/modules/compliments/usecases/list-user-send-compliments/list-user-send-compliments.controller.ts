import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatus } from '~shared/infra/http/enums';

import { ListUserSendComplimentsUseCase } from './list-user-send-compliments.usecase';

export class ListUserSendComplimentsController {
  public async handle(
    httpRequest: Request,
    httpResponse: Response
  ): Promise<Response> {
    const { id: userId } = httpRequest.user;

    const listUserSendComplimentsUseCase = container.resolve(
      ListUserSendComplimentsUseCase
    );

    const compliments = await listUserSendComplimentsUseCase.execute({
      userId
    });

    return httpResponse.status(HttpStatus.OK).json(compliments);
  }
}
