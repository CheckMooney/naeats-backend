import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';

export class RefreshResponse extends BaseResponse {
  @ApiProperty({ description: 'Access Token' })
  accessToken: string;
}
