import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ApiAuth, ApiBaseResponse } from 'src/docs/decorators';
import { User } from 'src/users/entities/user.entitiy';
import { CreateEatLogDto, UpdateEatLogDto } from './dtos';
import { EatLogsService } from './eat-logs.service';
import { GetEatLogResponse, GetEatLogsResponse } from './responses';

@ApiTags('EatLog')
@ApiAuth('AccessToken')
@UseGuards(JwtAccessGuard)
@Controller('eat-logs')
export class EatLogsController {
  constructor(private readonly eatLogsService: EatLogsService) {}

  @Get()
  @ApiOperation({ description: '사용자가 먹은 음식 로그 불러오기' })
  @ApiResponse({ status: 200, type: GetEatLogsResponse })
  async getEatLogs(@AuthUser() user: User) {
    const eatLogs = await this.eatLogsService.getEatLogs(user.id);
    return {
      eatLogs,
    };
  }

  @Post()
  @ApiOperation({ description: '음식 먹은 로그 만들기' })
  @ApiBaseResponse({ status: 201 })
  async createEatLog(
    @AuthUser() user: User,
    @Body() createEatLogDto: CreateEatLogDto,
  ) {
    await this.eatLogsService.createEatLog(user.id, createEatLogDto);
    return {
      statusCode: 201,
    };
  }

  @Get('/:id')
  @ApiOperation({ description: '음식 먹은 로그 불러오기' })
  @ApiResponse({ status: 200, type: GetEatLogResponse })
  async getEatLog(@AuthUser() user: User, @Param('id') eatLogId: string) {
    const eatLog = await this.eatLogsService.getEatLog(user.id, eatLogId);
    return {
      statusCode: 200,
      eatLog,
    };
  }

  @Put('/:id')
  @ApiOperation({ description: '음식 먹은 로그 수정' })
  @ApiBaseResponse({ status: 201 })
  async updateEatLog(
    @Param('id') eatLogId: string,
    @Body() updateEatLogDto: UpdateEatLogDto,
  ) {
    await this.eatLogsService.updateEatLog(eatLogId, updateEatLogDto);
    return {
      status: 201,
    };
  }

  @Delete('/:id')
  @ApiOperation({ description: '음식 먹은 로그 삭제' })
  @ApiBaseResponse({ status: 201 })
  async deleteEatLog(@Param('id') eatLogId: string) {
    await this.eatLogsService.deleteEatLog(eatLogId);
    return {
      status: 201,
    };
  }
}
