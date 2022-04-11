import { ApiProperty, PickType } from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/responses/pagination.response';
import { Food } from 'src/foods/entities';
import { EatLog } from '../entities/eat-log.entity';

class EatLogFoodResponseData extends PickType(Food, [
  'id',
  'name',
  'thumbnail',
  'categories',
] as const) {}

class EatLogResponseData extends PickType(EatLog, [
  'id',
  'eatDate',
  'description',
] as const) {
  @ApiProperty({ description: '음식 정보', type: EatLogFoodResponseData })
  food: EatLogFoodResponseData;
}

export class GetEatLogsResponse extends PaginationResponse {
  @ApiProperty({
    description: '음식 먹은 기록들',
    isArray: true,
    type: EatLogResponseData,
  })
  eatLogs: EatLogResponseData[];
}
