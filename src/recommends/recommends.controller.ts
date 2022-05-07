import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/docs/decorators';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { User } from 'src/users/entities/user.entitiy';
import { RecommendsService } from './recommends.service';
import { GetRecentRecommendsDto, GetRecommendsDto } from './dtos';
import { GetRecommendsResponse } from './responses';

@ApiTags('Recommends')
@ApiAuth('AccessToken')
@UseGuards(JwtAccessGuard)
@Controller('recommends')
export class RecommendsController {
  constructor(private readonly recommendsService: RecommendsService) {}

  @Get()
  @ApiOperation({ description: '음식 추천 리스트' })
  @ApiResponse({
    status: 200,
    type: GetRecommendsResponse,
  })
  async getRecommends(
    @AuthUser() user: User,
    @Query() getRecommendsDto: GetRecommendsDto,
  ) {
    const { recommends, totalCount } =
      await this.recommendsService.getRecommends(user.id, getRecommendsDto);
    return {
      statusCode: 200,
      recommends,
      totalCount,
    };
  }

  @Get('recent')
  @ApiOperation({ description: '최근 많은 사람들이 먹은 음식 추천 리스트' })
  async getRecentRecommends(
    @AuthUser() user: User,
    @Query() { hour = 1 }: GetRecentRecommendsDto,
  ) {
    const recommends = await this.recommendsService.getRecentRecommends(
      user.id,
      hour,
    );
    console.log(hour);
    return {
      statusCode: 200,
      recommends,
    };
  }
}
