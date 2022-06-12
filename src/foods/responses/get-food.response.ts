import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { FoodResponseData } from './food.response';

export class GetFoodResponseData extends FoodResponseData {
  @ApiProperty({ description: '해당 음식을 좋아하는 사용자 수' })
  likeCount: number;
}

export abstract class GetFoodResponse extends BaseResponse {
  @ApiProperty({ description: '음식 정보' })
  food: GetFoodResponseData;
}
