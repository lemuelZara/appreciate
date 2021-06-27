import { inject, injectable } from 'tsyringe';

import { Compliment } from '~modules/compliments/entities';
import { ComplimentRepositoryProtocols } from '~modules/compliments/infra/protocols';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';

import { BadRequestException } from '~shared/errors/http-errors';

type HttpRequest = {
  message: string;
  tagId: string;
  userSenderId: string;
  userReceiverId: string;
};

@injectable()
export class AddComplimentUseCase {
  constructor(
    @inject('ComplimentRepository')
    private complimentRepository: ComplimentRepositoryProtocols,
    @inject('UserRepository')
    private userRepository: UserRepositoryProtocols
  ) {}

  public async execute({
    message,
    tagId,
    userSenderId,
    userReceiverId
  }: HttpRequest): Promise<Compliment> {
    if (userSenderId === userReceiverId) {
      throw new BadRequestException('Incorrect User Receiver/Sender!');
    }

    const userReceiverExists = await this.userRepository.findById(
      userReceiverId
    );

    if (!userReceiverExists) {
      throw new BadRequestException('User Receiver does not exists!');
    }

    const compliment = await this.complimentRepository.add({
      message,
      tagId,
      userSenderId,
      userReceiverId
    });

    return compliment;
  }
}
