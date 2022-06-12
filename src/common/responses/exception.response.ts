import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ErrorCode } from 'src/@types';

export class ExceptionResponse {
  @ApiProperty({ description: 'Http status code' })
  statusCode: number;

  @ApiPropertyOptional({ description: 'Error Code' })
  errorCode?: ErrorCode;

  @ApiPropertyOptional({ description: 'Error Message' })
  message?: string;
}
