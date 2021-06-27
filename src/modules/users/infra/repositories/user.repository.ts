import { AddUserDTO } from '~modules/users/dtos';
import { User } from '~modules/users/entities';
import { UserRepositoryProtocols } from '~modules/users/infra/protocols';

import { prisma } from '~shared/infra/database/prisma/client';

export class UserRepository implements UserRepositoryProtocols {
  public async add({
    name,
    email,
    admin,
    password
  }: AddUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        admin,
        password
      }
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { email }
    });

    return user;
  }

  public async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  }

  public async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();

    return users;
  }
}
