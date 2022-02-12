import { PickType } from '@nestjs/swagger';
import { Food } from '../entities/food.entity';

export class CreateFoodDto extends PickType(Food, [
  'name',
  'category',
  'thumbnail',
]) {}
