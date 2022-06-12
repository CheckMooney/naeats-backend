import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ApiAuth, ApiBaseResponse } from 'src/docs/decorators';
import { User } from 'src/users/entities/user.entitiy';
import { EatLogsService } from './eat-logs.service';
import {
  CreateOrUpdateEatLogDto,
  DeleteEatLogDto,
  GetEatLogsDto,
} from './dtos';
import { GetEatLogsResponse } from './responses';

@ApiTags('EatLogs')
@ApiAuth('AccessToken')
@UseGuards(JwtAccessGuard)
@Controller('eat-logs')
export class EatLogsController {
  constructor(private readonly eatLogsService: EatLogsService) {}

  @Get()
  @ApiOperation({ description: '사용자가 먹은 음식 로그 불러오기' })
  @ApiResponse({ status: 200, type: GetEatLogsResponse })
  async getEatLogs(
    @AuthUser() user: User,
    @Query() getEatLogsDto: GetEatLogsDto,
  ) {
    const { eatLogs, totalCount } = await this.eatLogsService.getEatLogs(
      user.id,
      getEatLogsDto,
    );
    return {
      statusCode: 200,
      eatLogs,
      totalCount,
    };
  }

  @Post()
  @ApiOperation({ description: '음식 먹은 로그 생성 또는 수정' })
  @ApiBaseResponse({ status: 201 })
  async createEatLog(
    @AuthUser() user: User,
    @Body() createOrUpdateEatLogDto: CreateOrUpdateEatLogDto,
  ) {
    await this.eatLogsService.createOrUpdateEatLog(
      user.id,
      createOrUpdateEatLogDto,
    );
    return {
      statusCode: 201,
    };
  }

  @Delete()
  @ApiOperation({ description: '음식 먹은 로그 삭제' })
  @ApiBaseResponse({ status: 201 })
  async deleteEatLog(
    @AuthUser() user: User,
    @Body() { foodId }: DeleteEatLogDto,
  ) {
    await this.eatLogsService.deleteEatLog(user.id, foodId);
    return {
      statusCode: 201,
    };
  }
}
