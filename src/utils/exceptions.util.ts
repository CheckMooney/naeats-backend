import { ErrorCode } from 'src/@types';
import { ExceptionMessage } from 'src/common/constants/messages.constant';

export const getExceptionMessage = (errorCode: ErrorCode) =>
  ExceptionMessage[errorCode];
