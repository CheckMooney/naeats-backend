import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty()
  @IsBoolean()
  isDislike: boolean;
}
