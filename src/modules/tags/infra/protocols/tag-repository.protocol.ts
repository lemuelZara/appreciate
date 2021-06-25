import { AddTagDTO } from '~modules/tags/dtos';
import { Tag } from '~modules/tags/entities';

export type TagRepositoryProtocols = {
  add({ name }: AddTagDTO): Promise<Tag>;
};
