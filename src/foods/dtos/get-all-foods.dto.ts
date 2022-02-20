import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetAllFoodsDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  categories?: string | string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  or?: boolean;
}
