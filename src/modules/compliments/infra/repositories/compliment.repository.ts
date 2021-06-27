import { Compliment } from '~modules/compliments/entities';
import { AddComplimentDTO } from '~modules/compliments/dtos';
import { ComplimentRepositoryProtocols } from '~modules/compliments/infra/protocols';

import { prisma } from '~shared/infra/database/prisma/client';

export class ComplimentRepository implements ComplimentRepositoryProtocols {
  public async add({
    message,
    tagId,
    userSenderId,
    userReceiverId
  }: AddComplimentDTO): Promise<Compliment> {
    const compliment = await prisma.compliment.create({
      data: {
        message,
        tag: {
          connect: { id: tagId }
        },
        userSender: {
          connect: { id: userSenderId }
        },
        userReceiver: {
          connect: { id: userReceiverId }
        }
      }
    });

    return compliment;
  }

  public async findUserReceiveCompliments(
    userId: string
  ): Promise<Compliment[]> {
    const compliments = await prisma.compliment.findMany({
      where: { userReceiverId: userId },
      include: {
        tag: true,
        userReceiver: true,
        userSender: true
      }
    });

    return compliments;
  }
}
