export class HttpException {
  public readonly response: string | Record<string, any>;

  public readonly statusCode: number;

  constructor(response: string | Record<string, any>, statusCode: number) {
    this.response = response;
    this.statusCode = statusCode;
  }

  public static createBody(
    error: string,
    description?: string,
    statusCode?: number
  ) {
    return {
      statusCode,
      message: error,
      error: description
    };
  }
}
