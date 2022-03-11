import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: '페이지 번호' })
  @IsNumber()
  page: number;

  @ApiProperty({ description: '페이지 당 불러올 데이터 수' })
  @IsNumber()
  limit: number;
}
