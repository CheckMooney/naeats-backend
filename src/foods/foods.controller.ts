import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService, FoodsService } from './foods.service';
import {
  CreateFoodDto,
  GetAllFoodsDto,
  GetFoodsDto,
  UpdateFoodDto,
} from './dtos';

@ApiTags('Foods')
@Controller('foods')
export class FoodsController {
  constructor(
    private readonly foodsService: FoodsService,
    private readonly categoriesService: CategoriesService,
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
}
