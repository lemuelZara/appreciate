import { injectable, inject } from 'tsyringe';

import { Tag } from '~modules/tags/entities';
import { TagRepositoryProtocols } from '~modules/tags/infra/protocols';
import { BadRequestException } from '~shared/errors/http-errors';

type HttpRequest = {
  name: string;
};

@injectable()
export class AddTagUseCase {
  constructor(
    @inject('TagRepository') private tagRepository: TagRepositoryProtocols
  ) {}

  public async execute({ name }: HttpRequest): Promise<Tag> {
    if (!name) {
      throw new BadRequestException('Name not provided!');
    }

    const tagAlreadyExists = await this.tagRepository.findByName(name);

    if (tagAlreadyExists) {
      throw new BadRequestException('Tag already exists!');
    }

    const tag = await this.tagRepository.add({ name });

    return tag;
  }
}
