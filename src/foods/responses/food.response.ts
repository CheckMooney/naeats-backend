import { ApiProperty, PickType } from '@nestjs/swagger';
import { Food } from '../entities';

export abstract class FoodResponseData extends PickType(Food, [
  'id',
  'name',
  'thumbnail',
  'categories',
] as const) {
  @ApiProperty({ description: '음식을 좋아하는 여부' })
  isLike: boolean;

  @ApiProperty({ description: '음식을 가장 마지막에 먹은 날짜' })
  lastEatDate: Date | null;
}
