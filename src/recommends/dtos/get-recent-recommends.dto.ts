import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetRecentRecommendsDto {
  @ApiPropertyOptional({
    description: '최근 N시간 동안 가장 많이 먹은 음식 (1 <= N <= 24)',
    default: 1,
    minimum: 1,
    maximum: 24,
  })
  @IsNumber()
  @Max(24)
  @Min(1)
  @IsOptional()
  hour?: number;
}
