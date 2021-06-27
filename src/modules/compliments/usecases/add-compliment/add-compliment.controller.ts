import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AddComplimentUseCase } from './add-compliment.usecase';

import { HttpStatus } from '~shared/infra/http/enums';

export class AddComplimentController {
  public async handle(
    httpRequest: Request,
    httpResponse: Response
  ): Promise<Response> {
    const { message, tagId, userSenderId, userReceiverId } = httpRequest.body;

    const addComplimentUseCase = container.resolve(AddComplimentUseCase);

    const compliment = await addComplimentUseCase.execute({
      message,
      tagId,
      userSenderId,
      userReceiverId
    });

    return httpResponse.status(HttpStatus.CREATED).json(compliment);
  }
}
