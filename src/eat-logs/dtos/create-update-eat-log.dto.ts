import { PickType } from '@nestjs/swagger';
import { EatLog } from '../entities/eat-log.entity';

export class CreateOrUpdateEatLogDto extends PickType(EatLog, [
  'foodId',
  'eatDate',
  'description',
] as const) {}
