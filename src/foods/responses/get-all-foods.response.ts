import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { FoodResponseData } from './food.response';

export class GetAllFoodsResponse extends BaseResponse {
  @ApiProperty({
    description: '음식 데이터',
    isArray: true,
    type: FoodResponseData,
  })
  foods: FoodResponseData[];
}
