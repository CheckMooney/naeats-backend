import { HttpException } from '@nestjs/common';
import { ErrorCode } from 'src/@types';
import { getExceptionMessage } from 'src/utils/exceptions.util';

export class CustomException extends HttpException {
  constructor(status: number, errorCode: ErrorCode) {
    super(
      {
        statusCode: status,
        errorCode,
        message: getExceptionMessage(errorCode),
      },
      status,
    );
  }
}
