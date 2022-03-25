import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/responses/pagination.response';
import { GetEatLogResponseData } from './get-eat-log.response';

export class GetEatLogsResponse extends PaginationResponse {
  @ApiProperty({
    description: '음식 먹은 기록들',
    isArray: true,
    type: GetEatLogResponseData,
  })
  eatLogs: GetEatLogResponseData[];
}
