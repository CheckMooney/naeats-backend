import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseResponse {
  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;
}
