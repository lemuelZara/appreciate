import { inject, injectable } from 'tsyringe';

import { UserRepository } from '~modules/users/infra/repositories';
import { User } from '~modules/users/entities';

import { AppError } from '~shared/errors';
import { HttpStatus } from '~shared/infra/http/enums';

type HttpRequest = {
  name: string;
  email: string;
  admin?: boolean;
};

@injectable()
export class AddUserUseCase {
  constructor(@inject('UserRepository') private userRepository: UserRepository) {}

  public async execute({ name, email, admin }: HttpRequest): Promise<User> {
    if (!email) {
      throw new AppError('Email is not provided!', HttpStatus.BAD_REQUEST);
    }

    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError('User already exists!', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.add({ name, email, admin });

    return user;
  }
}
