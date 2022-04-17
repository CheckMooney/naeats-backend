import { ApiProperty, PickType } from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/responses/pagination.response';
import { Food } from 'src/foods/entities';

class RecommendData extends PickType(Food, [
  'id',
  'name',
  'thumbnail',
  'categories',
] as const) {
  @ApiProperty({ description: '음식을 가장 마지막에 먹은 날짜' })
  lastEatDate: Date | null;

  @ApiProperty({ description: '음식을 좋아하는 여부' })
  isLike: boolean;
}

export class GetRecommendsResponse extends PaginationResponse {
  @ApiProperty({
    description: '추천 음식 정보',
    type: RecommendData,
    isArray: true,
  })
  recommends: RecommendData[];
}
