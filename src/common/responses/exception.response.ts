import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ErrorCode } from 'src/@types';

export class ExceptionResponse {
  @ApiProperty()
  statusCode: number;

  @ApiPropertyOptional()
  errorCode?: ErrorCode;

  @ApiPropertyOptional()
  message?: string;
}
