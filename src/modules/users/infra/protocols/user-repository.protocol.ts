import { AddUserDTO } from '~modules/users/dtos';
import { User } from '~modules/users/entities';

export type UserRepositoryProtocols = {
  add(data: AddUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
};
