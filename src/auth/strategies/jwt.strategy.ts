import { HttpStatus } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { CustomException } from 'src/common/exceptions/custom.exception';

export class JwtStrategy extends Strategy {
  validatePayload(payload: any) {
    if (typeof payload.exp !== 'number' || typeof payload.userId !== 'string') {
      throw new CustomException(HttpStatus.UNAUTHORIZED, 40101);
    }
    if (payload.exp * 1000 < Date.now()) {
      throw new CustomException(HttpStatus.UNAUTHORIZED, 40102);
    }
    return payload.userId;
  }
}
