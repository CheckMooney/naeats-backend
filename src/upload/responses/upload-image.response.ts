import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';

export class UploadImageResponse extends BaseResponse {
  @ApiProperty({ description: '업로드된 이미지 경로' })
  path: string;
}
