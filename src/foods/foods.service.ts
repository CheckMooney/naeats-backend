import { Op } from 'sequelize';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Food } from './entities/food.entity';
import { Category } from './entities/category.entity';
import { FoodCategory } from './entities/food-category.entitiy';
import { CustomException } from 'src/common/exceptions/custom.exception';
import {
  CreateFoodDto,
  GetAllFoodsDto,
  GetFoodsDto,
  UpdateFoodDto,
} from './dtos';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
  ) {}

  async findAll(): Promise<Category[]> {
    const caterories = await this.categoryModel.findAll({
      attributes: ['id', 'name'],
    });
    return caterories;
  }

  async findOrCreate(name: string): Promise<Category> {
    const [category] = await this.categoryModel.findOrCreate({
      where: { name },
    });
    return category;
  }
}

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(Food)
    private readonly foodModel: typeof Food,
    @InjectModel(FoodCategory)
    private readonly foodCategoryModel: typeof FoodCategory,
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
}
