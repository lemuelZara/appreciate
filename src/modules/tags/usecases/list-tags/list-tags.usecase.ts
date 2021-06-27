import { inject, injectable } from 'tsyringe';

import { Tag } from '~modules/tags/entities';
import { TagRepositoryProtocols } from '~modules/tags/infra/protocols';

@injectable()
export class ListTagsUseCase {
  constructor(
    @inject('TagRepository') private tagRepository: TagRepositoryProtocols
  ) {}

  public async execute(): Promise<Tag[]> {
    const tags = await this.tagRepository.findAll();

    return tags;
  }
}
