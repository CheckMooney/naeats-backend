import { ApiProperty } from '@nestjs/swagger';

export class GoogleIdTokenDto {
  @ApiProperty()
  idToken: string;
}
