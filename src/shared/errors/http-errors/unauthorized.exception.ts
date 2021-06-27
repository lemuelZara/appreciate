import { HttpException } from '~shared/errors';
import { HttpStatus } from '~shared/infra/http/enums';

export class UnauthorizedException extends HttpException {
  constructor(error: string, description = 'Unauthorized') {
    super(
      HttpException.createBody(error, description, HttpStatus.UNAUTHORIZED),
      HttpStatus.UNAUTHORIZED
    );
  }
}
