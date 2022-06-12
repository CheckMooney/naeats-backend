import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { FoodResponseData } from 'src/foods/responses/food.response';

export class RecentRecommendsData extends FoodResponseData {
  @ApiProperty({
    description: '최근 먹은 음식 사람 수',
  })
  eatlogCnt: number;
}

export class GetRecentRecommendsResponse extends BaseResponse {
  @ApiProperty({
    description: '사람들이 최근 많이 먹은 추천 음식',
    type: RecentRecommendsData,
    isArray: true,
  })
  recommends: RecentRecommendsData;
}
