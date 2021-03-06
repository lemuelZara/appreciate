import { AddUserDTO } from '~modules/users/dtos';
import { User } from '~modules/users/entities';

export type UserRepositoryProtocols = {
  add(data: AddUserDTO): Promise<User>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
};
