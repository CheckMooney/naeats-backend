import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class PaginationResponse extends BaseResponse {
  @ApiProperty({ description: '총 데이터 개수' })
  totalCount: number;
}
