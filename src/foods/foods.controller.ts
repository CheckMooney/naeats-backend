import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FoodsService,
  CategoriesService,
  UserLikeFoodService,
} from './providers';
import {
  CreateFoodDto,
  GetAllFoodsDto,
  GetFoodsDto,
  UpdateFoodDto,
} from './dtos';
import {
  GetAllFoodsResponse,
  GetCategoriesResponse,
  GetFoodResponse,
  GetFoodsResponse,
  GetLikeFoodsResponse,
  UserLikeOrDislikeFoodResponse,
} from './responses';
import { User } from 'src/users/entities/user.entitiy';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ApiAuth, ApiBaseResponse } from 'src/docs/decorators';

@ApiTags('Foods')
@ApiAuth('AccessToken')
@UseGuards(JwtAccessGuard)
@Controller('foods')
export class FoodsController {
  constructor(
    private readonly foodsService: FoodsService,
    private readonly categoriesService: CategoriesService,
    private readonly userLikeFoodService: UserLikeFoodService,
  ) {}

  @Get()
  @ApiOperation({ description: 'Pagination된 음식 정보 가져오기' })
  @ApiResponse({
    status: 200,
    type: GetFoodsResponse,
  })
  async getFoods(@Query() getFoodsDto: GetFoodsDto) {
    const { foods, totalCount } = await this.foodsService.getFoods(getFoodsDto);
    return {
      statusCode: 200,
      foods,
      totalCount,
    };
  }

  @Post()
  @ApiOperation({ description: '새로운 음식 만들기' })
  @ApiBaseResponse({ status: 201 })
  async createFood(@Body() createFoodDto: CreateFoodDto) {
    await this.foodsService.createFood(createFoodDto);
    return {
      status: 201,
    };
  }

  @Get('/all')
  @ApiOperation({ description: '모든 음식 정보 가져오기' })
  @ApiResponse({
    status: 200,
    type: GetAllFoodsResponse,
  })
  async getAllFoods(@Query() getAllFoodsDto: GetAllFoodsDto) {
    const foods = await this.foodsService.getAllFoods(getAllFoodsDto);
    return {
      statusCode: 200,
      foods,
    };
  }

  @Get('/category')
  @ApiOperation({ description: '모든 카테고리 가져오기' })
  @ApiResponse({ status: 200, type: GetCategoriesResponse })
  async getCategories() {
    const categories = await this.categoriesService.findAll();
    return {
      statusCode: 200,
      categories,
    };
  }

  @Get('/like')
  @ApiOperation({ description: '사용자가 좋아하는 음식 가져오기' })
  @ApiResponse({
    status: 200,
    type: GetLikeFoodsResponse,
  })
  async getLikeFoods(@AuthUser() user: User) {
    const foods = await this.foodsService.getLikeFoods(user.id);
    return {
      statusCode: 200,
      foods,
    };
  }

  @Post('/like/:id')
  @ApiOperation({ description: '음식 좋아요 또는 취소' })
  @ApiResponse({ status: 201, type: UserLikeOrDislikeFoodResponse })
  async userLikeOrDislikeFood(
    @AuthUser() user: User,
    @Param('id') foodId: string,
  ) {
    const isLike = await this.userLikeFoodService.userLikeOrDislikeFood(
      user.id,
      foodId,
    );
    return {
      status: 201,
      isLike,
    };
  }

  @Get(':id')
  @ApiOperation({ description: '해당 음식 정보 가져오기' })
  @ApiResponse({ status: 200, type: GetFoodResponse })
  async getFood(@AuthUser() user: User, @Param('id') foodId: string) {
    const food = await this.foodsService.getFood(user.id, foodId);
    return {
      statusCode: 200,
      food,
    };
  }

  @Put(':id')
  @ApiOperation({ description: '기존 음식 수정하기' })
  @ApiBaseResponse({ status: 200 })
  async updateFood(
    @Param('id') id: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    await this.foodsService.updateFood(id, updateFoodDto);
    return {
      status: 200,
    };
  }

  @Delete(':id')
  @ApiOperation({ description: '기존 음식 삭제하기' })
  @ApiBaseResponse({ status: 200 })
  async deleteFood(@Param('id') id: string) {
    await this.foodsService.deleteFood(id);
    return {
      status: 200,
    };
  }
}
