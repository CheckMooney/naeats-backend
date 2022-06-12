import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';

export const ApiBaseResponse = ({
  status,
  description,
}: {
  status?: number;
  description?: string;
}) =>
  applyDecorators(
    ApiResponse({
      status,
      description,
      type: BaseResponse,
    }),
  );
