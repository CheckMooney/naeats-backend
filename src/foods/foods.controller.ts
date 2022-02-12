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
import { ApiTags } from '@nestjs/swagger';
import {
  CreateFoodDto,
  GetAllFoodsDto,
  GetFoodsDto,
  UpdateFoodDto,
} from './dtos';
import { FoodCategory } from './enums/food-category.enum';
import { FoodsService } from './foods.service';

@ApiTags('Foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  getFoods(@Query() getFoodsDto: GetFoodsDto) {
    return this.foodsService.getFoods(getFoodsDto);
  }

  @Post()
  createFood(@Body() createFoodDto: CreateFoodDto) {
    this.foodsService.createFood(createFoodDto);
  }

  @Put(':id')
  updateFood(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodsService.updateFood(id, updateFoodDto);
  }

  @Delete(':id')
  deleteFood(@Param('id') id: string) {
    return this.foodsService.deleteFood(id);
  }

  @Get('/all')
  getAllFoods(@Query() getAllFoodsDto: GetAllFoodsDto) {
    return this.foodsService.getAllFoods(getAllFoodsDto);
  }

  @Get('/category')
  getFoodCategories() {
    return Object.keys(FoodCategory);
  }
}
