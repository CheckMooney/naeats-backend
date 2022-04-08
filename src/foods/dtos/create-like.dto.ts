import { ApiProperty, PickType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean } from 'class-validator';
import { Food } from '../entities';

export class CreateLikeDto {
  @ApiProperty()
  @IsBoolean()
  isDislike: boolean;
}
