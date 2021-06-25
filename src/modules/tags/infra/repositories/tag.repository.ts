import { AddTagDTO } from '~modules/tags/dtos';
import { Tag } from '~modules/tags/entities';
import { TagRepositoryProtocols } from '~modules/tags/infra/protocols';

import { prisma } from '~shared/infra/database/prisma/client';

export class TagRepository implements TagRepositoryProtocols {
  public async add({ name }: AddTagDTO): Promise<Tag> {
    const tag = await prisma.tag.create({ data: { name } });

    return tag;
  }

  public async findByName(name: string): Promise<Tag | null> {
    const tag = await prisma.tag.findFirst({ where: { name } });

    return tag;
  }
}
