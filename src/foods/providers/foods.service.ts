import sequelize, { Op } from 'sequelize';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CategoriesService } from './categories.service';
import { UserLikeFoodService } from './user-like-food.service';
import { Food, Category, FoodCategory, UserLikeFood } from '../entities';
import { User } from 'src/users/entities/user.entitiy';
import { EatLog } from 'src/eat-logs/entities/eat-log.entity';
import {
  CreateFoodDto,
  GetAllFoodsDto,
  GetFoodsDto,
  UpdateFoodDto,
} from '../dtos';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(Food)
    private readonly foodModel: typeof Food,
    @InjectModel(FoodCategory)
    private readonly foodCategoryModel: typeof FoodCategory,
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
      where: {
        id: foodId,
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
          [sequelize.literal('`eatlogs`.`eatDate`'), 'lastEatDate'],
          [sequelize.fn('COUNT', sequelize.col('likeUsers.id')), 'likeCount'],
        ],
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
          model: UserLikeFood,
          where: { userId: userId },
          required: false,
          attributes: [],
        },
        {
          model: User,
          attributes: [],
          through: {
            attributes: [],
          },
        },
        {
          model: EatLog,
          as: 'eatlogs',
          where: {
            userId,
          },
          attributes: [],
          required: false,
        },
      ],
      group: ['id', 'eatlogs.id', 'categories.id'],
    });
    if (!food) {
      throw new CustomException(HttpStatus.NOT_FOUND, 40401);
    }

    const plainFood = food.get({ plain: true });
    return {
      ...plainFood,
      isLike: Boolean(plainFood.isLike),
      categories: plainFood.categories.map(({ name }) => name),
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
          [sequelize.literal('`eatlogs`.`eatDate`'), 'lastEatDate'],
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
        {
          model: EatLog,
          as: 'eatlogs',
          where: {
            userId,
          },
          attributes: [],
          required: false,
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
          [sequelize.literal('`eatlogs`.`eatDate`'), 'lastEatDate'],
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
        {
          model: EatLog,
          as: 'eatlogs',
          where: {
            userId,
          },
          attributes: [],
          required: false,
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

  async getLikeOrDislikeFoods(userId: string, isLike: boolean) {
    const foods = await this.foodModel.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
        include: [
          [
            sequelize.literal(
              'IF(`UserLikeFood`.`isDislike` is False, True, False)',
            ),
            'isLike',
          ],
          [sequelize.literal('`eatlogs`.`eatDate`'), 'lastEatDate'],
        ],
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
          model: UserLikeFood,
          required: true,
          where: {
            userId,
            isDislike: !isLike,
          },
          attributes: [],
        },
        {
          model: EatLog,
          as: 'eatlogs',
          where: {
            userId,
          },
          attributes: [],
          required: false,
        },
      ],
    });

    return foods.map((food) => {
      food = food.get({ plain: true });
      food.categories = food.categories.map((category) => category.name) as any;
      food.isLike = Boolean(food.isLike);
      return food;
    });
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
