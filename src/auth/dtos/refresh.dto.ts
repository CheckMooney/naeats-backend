import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponse {
  @ApiProperty({ description: 'Access Token' })
  accessToken: string;
}
