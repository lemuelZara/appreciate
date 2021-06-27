import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListTagsUseCase } from './list-tags.usecase';

import { HttpStatus } from '~shared/infra/http/enums';

export class ListTagsController {
  public async handle(
    httpRequest: Request,
    httpResponse: Response
  ): Promise<Response> {
    const listTagsUseCase = container.resolve(ListTagsUseCase);

    const tags = await listTagsUseCase.execute();

    return httpResponse.status(HttpStatus.OK).json(tags);
  }
}
