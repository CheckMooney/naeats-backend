import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { User } from '../entities/user.entitiy';

export class GetProfileResponseData extends PickType(User, [
  'id',
  'email',
  'username',
  'profileImg',
] as const) {}

export class GetProfileResponse extends BaseResponse {
  @ApiProperty({ description: '사용자 프로필' })
  profile: GetProfileResponseData;
}
