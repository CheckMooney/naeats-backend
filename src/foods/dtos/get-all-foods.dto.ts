import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { TransformBoolean } from 'src/common/decorators/transform-boolean.decorator';

export class GetAllFoodsDto {
  @ApiPropertyOptional({ description: '음식 카테고리들' })
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    description: '음식 카테고리 쿼리 옵션 (AND 또는 OR)',
    default: false,
  })
  @TransformBoolean()
  @IsOptional()
  @IsBoolean()
  or?: boolean = false;
}
