import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetAllFoodsDto {
  @ApiPropertyOptional({ description: '음식 카테고리들' })
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    description: '음식 카테고리 쿼리 옵션 (AND 또는 OR)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  or?: boolean;
}
