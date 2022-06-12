import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const ApiAuth = (type: 'AccessToken' | 'RefreshToken') =>
  applyDecorators(ApiBearerAuth(type));
