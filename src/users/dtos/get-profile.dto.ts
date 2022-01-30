import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entitiy';

export class GetProfileResponse extends PickType(User, [
  'id',
  'email',
  'username',
  'profileImg',
] as const) {}
