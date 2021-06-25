import { HttpException } from '~shared/errors';
import { HttpStatus } from '~shared/infra/http/enums';

export class BadRequestException extends HttpException {
  constructor(error: string, description = 'Bad Request') {
    super(
      HttpException.createBody(error, description, HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST
    );
  }
}
