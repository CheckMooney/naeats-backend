import { PartialType, PickType } from '@nestjs/swagger';
import { Food } from '../entities/food.entity';

export class GetAllFoodsDto extends PartialType(PickType(Food, ['category'])) {}
