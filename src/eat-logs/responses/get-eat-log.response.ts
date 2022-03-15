import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { Food } from 'src/foods/entities';
import { EatLog } from '../entities/eat-log.entity';

export class EatLogFood extends PickType(Food, [
  'id',
  'name',
  'thumbnail',
] as const) {}

export class GetEatLogResponseData extends PickType(EatLog, [
  'id',
  'eatDate',
  'description',
] as const) {
  @ApiProperty({ description: '해당 음식 정보' })
  food: EatLogFood;
}

export class GetEatLogResponse extends BaseResponse {
  @ApiProperty({ description: '음식 먹은 기록' })
  eatLog: GetEatLogResponseData;
}
