import { inject, injectable } from 'tsyringe';

import { Compliment } from '~modules/compliments/entities';
import { ComplimentRepositoryProtocols } from '~modules/compliments/infra/protocols';

type HttpRequest = {
  userId: string;
};

@injectable()
export class ListUserSendComplimentsUseCase {
  constructor(
    @inject('ComplimentRepository')
    private complimentRepository: ComplimentRepositoryProtocols
  ) {}

  public async execute({ userId }: HttpRequest): Promise<Compliment[]> {
    const userSendCompliments =
      await this.complimentRepository.findUserSendCompliments(userId);

    return userSendCompliments;
  }
}
