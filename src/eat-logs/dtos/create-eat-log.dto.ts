import { PickType } from '@nestjs/swagger';
import { EatLog } from '../entities/eat-log.entity';

export class CreateEatLogDto extends PickType(EatLog, [
  'foodId',
  'eatDate',
  'description',
] as const) {}
