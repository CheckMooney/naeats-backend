import { PickType } from '@nestjs/swagger';
import { EatLog } from '../entities/eat-log.entity';

export class DeleteEatLogDto extends PickType(EatLog, ['foodId'] as const) {}
