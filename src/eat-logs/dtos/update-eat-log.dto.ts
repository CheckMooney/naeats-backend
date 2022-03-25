import { PartialType, PickType } from '@nestjs/swagger';
import { EatLog } from '../entities/eat-log.entity';

export class UpdateEatLogDto extends PartialType(
  PickType(EatLog, ['eatDate', 'description'] as const),
) {}
