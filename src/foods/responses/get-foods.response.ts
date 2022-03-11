import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/responses/pagination.response';
import { FoodResponseData } from './food.response';

export class GetFoodsResponse extends PaginationResponse {
  @ApiProperty({
    description: '음식 데이터',
    isArray: true,
    type: FoodResponseData,
  })
  foods: FoodResponseData[];
}
