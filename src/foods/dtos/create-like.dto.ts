import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { TransformBoolean } from 'src/common/decorators/transform-boolean.decorator';

export class CreateLikeDto {
  @ApiProperty()
  @TransformBoolean()
  @IsBoolean()
  isDislike: boolean;
}
