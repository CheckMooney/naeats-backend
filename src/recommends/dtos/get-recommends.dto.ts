import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { TransformBoolean } from 'src/common/decorators/transform-boolean.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { OrderBy } from 'src/common/enums/order.enum';

export class GetRecommendsDto extends PaginationDto {
  @ApiProperty({ description: '먹은지 얼만큼 지난 것', required: true })
  @IsInt()
  @Min(0)
  day: number;

  @ApiProperty({
    description: '먹은 기록이 있는 것만 가져오기',
    required: true,
  })
  @TransformBoolean()
  @IsBoolean()
  isEat: boolean;

  @ApiProperty({
    description: '먹은 기록 정렬 옵션',
    enum: OrderBy,
  })
  @IsEnum(OrderBy)
  orderBy: OrderBy;
}
