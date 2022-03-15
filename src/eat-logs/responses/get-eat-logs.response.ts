import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { GetEatLogResponseData } from './get-eat-log.response';

export class GetEatLogsResponse extends BaseResponse {
  @ApiProperty({
    description: '음식 먹은 기록들',
    isArray: true,
    type: GetEatLogResponseData,
  })
  eatLogs: GetEatLogResponseData[];
}
