import { inject, injectable } from 'tsyringe';

import { UserRepository } from '~modules/users/infra/repositories';
import { User } from '~modules/users/entities';

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository
  ) {}

  public async execute(): Promise<User[]> {
    const users = await this.userRepository.findAll();

    return users;
  }
}
