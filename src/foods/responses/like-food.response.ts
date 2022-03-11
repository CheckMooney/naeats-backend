import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';

export class UserLikeOrDislikeFoodResponse extends BaseResponse {
  @ApiProperty({ description: '사용자가 해당 음식을 좋아하는지 여부' })
  isLike: boolean;
}
