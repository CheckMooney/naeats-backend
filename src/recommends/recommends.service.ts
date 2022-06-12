import sequelize, { Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { FoodsService } from 'src/foods/providers';
import { EatLogsService } from 'src/eat-logs/eat-logs.service';
import { InjectModel } from '@nestjs/sequelize';
import { Category, Food, UserLikeFood } from 'src/foods/entities';
import { EatLog } from 'src/eat-logs/entities/eat-log.entity';
import { GetRecommendsDto } from './dtos';
import { beforeNDay, beforeNHour } from 'src/utils/date.util';
import { OrderBy } from 'src/common/enums/order.enum';

@Injectable()
export class RecommendsService {
  constructor(
    private readonly foodsService: FoodsService,
    private readonly eatLogService: EatLogsService,
    @InjectModel(Food)
    private readonly foodModel: typeof Food,
  ) {}

  async getRecommends(
    userId: string,
    {
      day,
      isEat,
      isLike,
      orderBy,
      page,
      limit,
      categories,
      or,
    }: GetRecommendsDto,
  ) {
    const isRandom = orderBy === OrderBy.RAND;
    const categoryLiteralCondition =
      this.foodsService.getCategoryLiteralCondition(categories, or);
    const { rows, count } = await this.foodModel.findAndCountAll({
      attributes: [
        'id',
        'name',
        'thumbnail',
        [sequelize.literal('`eatlogs`.`eatDate`'), 'lastEatDate'],
        [
          sequelize.literal(
            'IF(`UserLikeFood`.`id` is not null AND `UserLikeFood`.`isDislike` is False, True, False)',
          ),
          'isLike',
        ],
      ],
      include: [
        {
          model: EatLog,
          as: 'eatlogs',
          where: {
            userId,
          },
          attributes: [],
          required: isEat,
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
        {
          model: UserLikeFood,
          required: false,
          where: {
            userId,
          },
          attributes: [],
        },
      ],
      order: [
        isRandom
          ? sequelize.fn('RAND')
          : [sequelize.literal('eatlogs.eatDate'), orderBy],
      ],
      where: {
        '$eatlogs.eatDate$': {
          [Op.or]: {
            [Op.lte]: beforeNDay(day),
            [Op.eq]: null,
          },
        },
        '$UserLikeFood.isDislike$': {
          [Op.or]: isLike ? [false] : [false, null],
        },
        ...categoryLiteralCondition,
      },
      distinct: true,
      subQuery: false,
      limit: limit,
      offset: (page - 1) * limit,
    });

    const recommends = rows.map((food) => {
      const plain = food.get({ plain: true });
      return {
        ...plain,
        isLike: Boolean(plain.isLike),
        categories: plain.categories.map(({ name }) => name),
      };
    });

    return {
      recommends,
      totalCount: count,
    };
  }

  async getRecentRecommends(userId: string, hour: number) {
    const foods = await this.foodModel.findAll({
      attributes: [
        'id',
        'name',
        'thumbnail',
        [sequelize.fn('COUNT', sequelize.col('eatlogs.eatDate')), 'eatlogCnt'],
        [
          sequelize.literal(
            'IF(`UserLikeFood`.`id` is not null AND `UserLikeFood`.`isDislike` is False, True, False)',
          ),
          'isLike',
        ],
      ],
      limit: 10,
      include: [
        {
          model: EatLog,
          as: 'eatlogs',
          where: {
            userId: {
              [Op.ne]: userId,
            },
            eatDate: {
              [Op.gte]: beforeNHour(hour),
            },
          },
          attributes: [],
          required: true,
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
        {
          model: UserLikeFood,
          required: false,
          where: {
            userId,
          },
          attributes: [],
        },
      ],
      order: [[sequelize.literal('eatlogCnt'), 'DESC']],
      group: ['id', 'categories.id'],
      subQuery: false,
    });

    const recommends = await Promise.all(
      foods.map((food) => this.addLastEatDate(food, userId)),
    );
    return recommends;
  }

  async addLastEatDate(food: Food, userId: string) {
    const plain = food.get({ plain: true });
    const lastEatDate = await this.eatLogService.findLastEatDate(
      userId,
      plain.id,
    );
    return {
      ...plain,
      lastEatDate,
      isLike: Boolean(plain.isLike),
      categories: plain.categories.map(({ name }) => name),
    };
  }
}
