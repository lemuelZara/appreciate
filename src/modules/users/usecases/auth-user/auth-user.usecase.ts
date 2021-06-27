import { inject, injectable } from 'tsyringe';

import { UserRepositoryProtocols } from '~modules/users/infra/protocols';

import { CryptoProtocols } from '~shared/container/providers/crypto/protocols';
import { JWTProtocols } from '~shared/container/providers/jwt/protocols';
import { BadRequestException } from '~shared/errors/http-errors';

import auth from '~config/auth';

type HttpRequest = {
  email: string;
  password: string;
};

type HttpResponse = {
  user: {
    name: string;
    email: string;
  };
  token: string;
};

@injectable()
export class AuthUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: UserRepositoryProtocols,
    @inject('CryptoProvider') private cryptoProvider: CryptoProtocols,
    @inject('JWTProvider') private jwtProvider: JWTProtocols
  ) {}

  public async execute({
    email,
    password
  }: HttpRequest): Promise<HttpResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Incorrect credentials, try again.');
    }

    const passwordMatch = await this.cryptoProvider.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new BadRequestException('Incorrect credentials, try again.');
    }

    const token = this.jwtProvider.generateToken(auth.privateKey, {
      algorithm: auth.algorithm,
      subject: user.id,
      expiresIn: auth.expiresIn
    });

    return {
      user: {
        name: user.name,
        email: user.email
      },
      token
    };
  }
}
