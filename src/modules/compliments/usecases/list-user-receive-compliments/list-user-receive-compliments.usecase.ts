import { inject, injectable } from 'tsyringe';

import { Compliment } from '~modules/compliments/entities';
import { ComplimentRepositoryProtocols } from '~modules/compliments/infra/protocols';

type HttpRequest = {
  userId: string;
};

@injectable()
export class ListUserReceiveComplimentsUseCase {
  constructor(
    @inject('ComplimentRepository')
    private complimentRepository: ComplimentRepositoryProtocols
  ) {}

  public async execute({ userId }: HttpRequest): Promise<Compliment[]> {
    const userReceivedCompliments =
      await this.complimentRepository.findUserReceiveCompliments(userId);

    return userReceivedCompliments;
  }
}
