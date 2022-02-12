import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Food } from './entities/food.entity';
import {
  CreateFoodDto,
  GetAllFoodsDto,
  GetFoodsDto,
  UpdateFoodDto,
} from './dtos';
import { CustomException } from 'src/common/exceptions/custom.exception';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(Food)
    private readonly foodModel: typeof Food,
  ) {}

  async findById(id: string) {
    const food = await this.foodModel.findByPk(id);
    if (!food) {
      throw new CustomException(HttpStatus.NOT_FOUND, 40401);
    }
    return food;
  }

  async getFoods({ page, limit, category }: GetFoodsDto) {
    const whereCondition = {
      ...(category && { category }),
    };
    const foods = await this.foodModel.findAndCountAll({
      limit,
      offset: limit * (page - 1),
      where: whereCondition,
    });
    return foods;
  }

  async getAllFoods({ category }: GetAllFoodsDto) {
    const whereCondition = {
      ...(category && { category }),
    };
    const foods = await this.foodModel.findAll({
      where: whereCondition,
    });
    return foods;
  }

  async createFood(createFoodDto: CreateFoodDto) {
    await this.foodModel.create(createFoodDto);
  }

  async updateFood(id: string, updateFoodDto: UpdateFoodDto) {
    const food = await this.findById(id);
    await food.update(updateFoodDto);
  }

  async deleteFood(id: string) {
    const food = await this.findById(id);
    food.destroy();
  }
}
