import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';

export class GetCategoriesResponse extends BaseResponse {
  @ApiProperty({ description: '모든 카테고리' })
  categories: string[];
}
