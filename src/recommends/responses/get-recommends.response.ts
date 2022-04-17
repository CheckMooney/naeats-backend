import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/responses/pagination.response';
import { FoodResponseData } from 'src/foods/responses/food.response';

export class GetRecommendsResponse extends PaginationResponse {
  @ApiProperty({
    description: '추천 음식 정보',
    type: FoodResponseData,
    isArray: true,
  })
  recommends: FoodResponseData[];
}
