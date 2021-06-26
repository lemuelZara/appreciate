import { inject, injectable } from 'tsyringe';

import { UserRepository } from '~modules/users/infra/repositories';
import { User } from '~modules/users/entities';

import { BadRequestException } from '~shared/errors/http-errors';

type HttpRequest = {
  name: string;
  email: string;
  admin?: boolean;
  password: string;
};

@injectable()
export class AddUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository
  ) {}

  public async execute({
    name,
    email,
    admin,
    password
  }: HttpRequest): Promise<User> {
    if (!email) {
      throw new BadRequestException('Email is not provided!');
    }

    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists!');
    }

    const user = await this.userRepository.add({
      name,
      email,
      admin,
      password
    });

    return user;
  }
}
