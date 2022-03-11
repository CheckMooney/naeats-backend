import { PickType } from '@nestjs/swagger';
import { Food } from '../entities';

export abstract class FoodResponseData extends PickType(Food, [
  'id',
  'name',
  'thumbnail',
] as const) {}
