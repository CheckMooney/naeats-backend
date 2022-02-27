import { Op } from 'sequelize';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CategoriesService } from './categories.service';
import { Food, Category, FoodCategory, UserLikeFood } from '../entities';
import {
  CreateFoodDto,
  GetAllFoodsDto,
  GetFoodsDto,
  UpdateFoodDto,
} from '../dtos';
import { User } from 'src/users/entities/user.entitiy';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(Food)
    private readonly foodModel: typeof Food,
    @InjectModel(FoodCategory)
    private readonly foodCategoryModel: typeof FoodCategory,
    @InjectModel(UserLikeFood)
    private readonly userLikeFoodModel: typeof UserLikeFood,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findById(id: string) {
    const food = await this.foodModel.findByPk(id);
    if (!food) {
      throw new CustomException(HttpStatus.NOT_FOUND, 40401);
    }
    return food;
  }

  getCategoryCondition(
    categories: undefined | string | string[],
    or: undefined | boolean,
  ) {
    const categoryOperator = or ? Op.or : Op.and;
    const categoryCondition = {
      ...(categories &&
        (typeof categories === 'string'
          ? {
              [categoryOperator]: {
                name: categories,
              },
            }
          : {
              [categoryOperator]: categories.map((category) => ({
                name: category,
              })),
            })),
    };
    return categoryCondition;
  }

  async getAllFoods({ categories, or }: GetAllFoodsDto) {
    const categoryCondition = this.getCategoryCondition(categories, or);
    const foods = await this.foodModel.findAll({
      attributes: ['id', 'name', 'thumbnail'],
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
          where: categoryCondition,
          through: {
            attributes: [],
          },
        },
      ],
    });
    return foods;
  }

  async getFoods({ page, limit, categories, or }: GetFoodsDto) {
    const categoryCondition = this.getCategoryCondition(categories, or);
    const foods = await this.foodModel.findAndCountAll({
      limit,
      offset: limit * (page - 1),
      attributes: ['id', 'name', 'thumbnail'],
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
          where: categoryCondition,
          through: {
            attributes: [],
          },
        },
      ],
    });
    return foods;
  }

  async createFoodCategory(foodId: string, categoryId: string) {
    await this.foodCategoryModel.create({
      foodId,
      categoryId,
    });
  }

  async createFood({ categories, ...createFoodDto }: CreateFoodDto) {
    const food = await this.foodModel.create(createFoodDto);
    for (const categoryName of categories) {
      const category = await this.categoriesService.findOrCreate(categoryName);
      await this.createFoodCategory(food.id, category.id);
    }
  }

  async updateFood(
    foodId: string,
    { categories, ...updateFoodDto }: UpdateFoodDto,
  ) {
    const food = await this.findById(foodId);
    await food.update(updateFoodDto);
    if (categories) {
      await this.foodCategoryModel.destroy({
        where: {
          foodId,
        },
      });
      for (const categoryName of categories) {
        const category = await this.categoriesService.findOrCreate(
          categoryName,
        );
        await this.createFoodCategory(foodId, category.id);
      }
    }
  }

  async deleteFood(foodId: string) {
    const food = await this.findById(foodId);
    food.destroy();
  }

  async getLikeFoodList(userId: string) {
    const foodList = await this.foodModel.findAll({
      attributes: ['id', 'name', 'thumbnail'],
      include: [
        {
          model: User,
          attributes: [],
          where: {
            id: userId,
          },
        },
      ],
    });
    return foodList;
  }
}
