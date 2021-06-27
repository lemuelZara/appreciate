import { AddComplimentDTO } from '~modules/compliments/dtos';
import { Compliment } from '~modules/compliments/entities';

export type ComplimentRepositoryProtocols = {
  add(data: AddComplimentDTO): Promise<Compliment>;
  findUserReceiveCompliments(userId: string): Promise<Compliment[]>;
};
