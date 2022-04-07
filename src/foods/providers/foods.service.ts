import { Op } from 'sequelize';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CategoriesService } from './categories.service';
import { UserLikeFoodService } from './user-like-food.service';
import { Food, Category, FoodCategory, UserLikeFood } from '../entities';
import {
  CreateFoodDto,
  GetAllFoodsDto,
  GetFoodsDto,
  UpdateFoodDto,
} from '../dtos';
import { User } from 'src/users/entities/user.entitiy';
import sequelize from 'sequelize';

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
    private readonly userLikeFoodService: UserLikeFoodService,
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

  getCategoryLiteralCondition(
    categories: undefined | string | string[],
    or: undefined | boolean,
  ): any {
    const literalCondition: sequelize.Utils.Literal[] = [];

    if (!categories || (Array.isArray(categories) && categories.length === 0))
      return {};

    if (typeof categories === 'string') {
      literalCondition.push(
        sequelize.literal(
          'exists (select `Categories`.`id` from `Categories`,`FoodCategories` where `Food`.`id` = `FoodCategories`.`foodId` and `FoodCategories`.`categoryId` = `Categories`.`id` and `Categories`.`name` in ("' +
            categories +
            '"))',
        ),
      );
    } else if (or) {
      const categorieStringArray = categories.join('","');
      literalCondition.push(
        sequelize.literal(
          'exists (select `Categories`.`id` from `Categories`,`FoodCategories` where `Food`.`id` = `FoodCategories`.`foodId` and `FoodCategories`.`categoryId` = `Categories`.`id` and `Categories`.`name` in ("' +
            categorieStringArray +
            '"))',
        ),
      );
    } else {
      categories.forEach((category) => {
        literalCondition.push(
          sequelize.literal(
            'exists (select `Categories`.`id` from `Categories`,`FoodCategories` where `Food`.`id` = `FoodCategories`.`foodId` and `FoodCategories`.`categoryId` = `Categories`.`id` and `Categories`.`name` in ("' +
              category +
              '"))',
          ),
        );
      });
    }

    return { [sequelize.Op.and]: literalCondition };
  }

  async getFood(userId: string, foodId: string) {
    const food = await this.foodModel.findOne({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
        include: [
          [sequelize.fn('COUNT', sequelize.col('likeUsers.id')), 'likeCount'],
        ],
      },
      where: {
        id: foodId,
      },
      include: [
        {
          model: Category,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          attributes: [],
        },
      ],
      subQuery: false,
      group: ['id', 'likeUsers.id', 'categories.id'],
    });
    if (!food) {
      throw new CustomException(HttpStatus.NOT_FOUND, 40401);
    }
    const isUserLikeFood = await this.userLikeFoodService.isUserLikeFoodExist(
      userId,
      foodId,
    );
    return {
      ...food.get({ plain: true }),
      categories: food.categories.map((category) => category.name),
      isLike: !!isUserLikeFood,
    };
  }

  async getAllFoods({ categories, or }: GetAllFoodsDto, userId?) {
    const categoryLiteralCondition = this.getCategoryLiteralCondition(
      categories,
      or,
    );

    const foods = await this.foodModel.findAll({
      where: {
        ...categoryLiteralCondition,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
        include: [
          [
            sequelize.literal(
              'IF(`UserLikeFood`.`id` is not null , True, False)',
            ),
            'isLike',
          ],
        ],
      },
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: UserLikeFood,
          required: false,
          where: { userId, isDislike: false },
          attributes: [],
        },
      ],
    });

    //TODO refactoring needed
    return foods.map((food) => {
      food = food.get({ plain: true });
      food.categories = food.categories.map((category) => category.name) as any;
      food.isLike = Boolean(food.isLike);
      return food;
    });
  }

  async getFoods({ page, limit, categories, or }: GetFoodsDto, userId?) {
    const categoryLiteralCondition = this.getCategoryLiteralCondition(
      categories,
      or,
    );

    const foods = await this.foodModel.findAndCountAll({
      where: {
        ...categoryLiteralCondition,
      },
      distinct: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
        include: [
          [
            sequelize.literal(
              'IF(`UserLikeFood`.`id` is not null , True, False)',
            ),
            'isLike',
          ],
        ],
      },
      limit,
      offset: limit * (page - 1),
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: UserLikeFood,
          required: false,
          where: { userId, isDislike: false },
          attributes: [],
        },
      ],
      subQuery: false,
    });

    return {
      foods: foods.rows.map((food) => {
        food = food.get({ plain: true });
        food.categories = food.categories.map(
          (category) => category.name,
        ) as any;
        food.isLike = Boolean(food.isLike);
        return food;
      }),
      totalCount: foods.count,
    };
  }

  async getLikeFoods(userId: string) {
    const likeFoods = await this.foodModel.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: UserLikeFood,
          required: true,
          where: { userId, isDislike: false },
          attributes: [],
        },
      ],
    });
    return likeFoods;
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
