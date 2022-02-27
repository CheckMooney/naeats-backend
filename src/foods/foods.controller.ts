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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  FoodsService,
  CategoriesService,
  UserLikeFoodService,
} from './services';
import {
  CreateFoodDto,
  GetAllFoodsDto,
  GetFoodsDto,
  UpdateFoodDto,
} from './dtos';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entitiy';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';

@ApiTags('Foods')
@Controller('foods')
export class FoodsController {
  constructor(
    private readonly foodsService: FoodsService,
    private readonly categoriesService: CategoriesService,
    private readonly userLikeFoodService: UserLikeFoodService,
  ) {}

  @Get()
  @ApiOperation({ description: '음식 정보 가져오기' })
  getFoods(@Query() getFoodsDto: GetFoodsDto) {
    return this.foodsService.getFoods(getFoodsDto);
  }

  @Post()
  @ApiOperation({ description: '새로운 음식 만들기' })
  createFood(@Body() createFoodDto: CreateFoodDto) {
    this.foodsService.createFood(createFoodDto);
  }

  @Put(':id')
  @ApiOperation({ description: '기존 음식 수정하기' })
  updateFood(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodsService.updateFood(id, updateFoodDto);
  }

  @Delete(':id')
  @ApiOperation({ description: '기존 음식 삭제하기' })
  deleteFood(@Param('id') id: string) {
    return this.foodsService.deleteFood(id);
  }

  @Get('/all')
  @ApiOperation({ description: '모든 음식 정보 가져오기' })
  getAllFoods(@Query() getAllFoodsDto: GetAllFoodsDto) {
    return this.foodsService.getAllFoods(getAllFoodsDto);
  }

  @Get('/category')
  @ApiOperation({ description: '모든 카테고리 가져오기' })
  getAllCategories() {
    return this.categoriesService.findAll();
  }

  @UseGuards(JwtAccessGuard)
  @Get('/like')
  @ApiOperation({ description: '사용자가 좋아하는 음식 가져오기' })
  @ApiBearerAuth('Access Token')
  getLikeFoodList(@AuthUser() user: User) {
    return this.foodsService.getLikeFoodList(user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Post('/like/:id')
  @ApiOperation({ description: '음식 좋아요 또는 취소' })
  @ApiBearerAuth('Access Token')
  userLikeOrDislikeFood(@AuthUser() user: User, @Param('id') foodId: string) {
    return this.userLikeFoodService.userLikeOrDislikeFood(user.id, foodId);
  }
}
