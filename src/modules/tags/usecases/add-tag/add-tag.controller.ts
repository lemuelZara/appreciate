import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AddTagUseCase } from './add-tag.usecase';

export class AddTagController {
  public async handle(
    httpRequest: Request,
    httpResponse: Response
  ): Promise<Response> {
    const { name } = httpRequest.body;

    const addTagUseCase = container.resolve(AddTagUseCase);

    const tag = await addTagUseCase.execute({ name });

    return httpResponse.status(201).json(tag);
  }
}
