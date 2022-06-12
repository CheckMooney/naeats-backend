import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { GetAllFoodsDto } from './get-all-foods.dto';

export class GetFoodsDto extends IntersectionType(
  PaginationDto,
  GetAllFoodsDto,
) {}
