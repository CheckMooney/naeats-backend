import { Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { Category, Food } from 'src/foods/entities';
import { FoodsService } from 'src/foods/providers';
import { User } from 'src/users/entities/user.entitiy';
import { UsersService } from 'src/users/users.service';
import { EatLog } from './entities/eat-log.entity';
import { CreateOrUpdateEatLogDto, GetEatLogsDto } from './dtos';

@Injectable()
export class EatLogsService {
  constructor(
    @InjectModel(EatLog)
    private readonly eatLogModel: typeof EatLog,
    private readonly usersService: UsersService,
    private readonly foodsService: FoodsService,
  ) {}

  async findById(eatLogId: string) {
    const eatLog = await this.eatLogModel.findByPk(eatLogId);
    if (!eatLog) {
      throw new CustomException(404, 40402);
    }
    return eatLog;
  }

  async findLastEatDate(userId: string, foodId: string) {
    const eatLog = await this.eatLogModel.findOne({
      include: [
        {
          model: User,
          where: {
            id: userId,
          },
        },
        {
          model: Food,
          where: {
            id: foodId,
          },
        },
      ],
    });
    if (!eatLog) {
      return null;
    }
    return eatLog.eatDate;
  }

  async getEatLogs(userId: string, { page, limit }: GetEatLogsDto) {
    const { rows, count } = await this.eatLogModel.findAndCountAll({
      attributes: ['id', 'eatDate', 'description'],
      include: [
        {
          model: Food,
          attributes: ['id', 'name', 'thumbnail'],
          include: [
            {
              model: Category,
              attributes: ['name'],
              through: {
                attributes: [],
              },
            },
          ],
        },
        {
          model: User,
          attributes: [],
          where: {
            id: userId,
          },
        },
      ],
      offset: limit * (page - 1),
      limit,
    });

    const eatLogs = rows.map((row) => {
      const plain = row.get({ plain: true });
      return {
        ...plain,
        food: {
          ...plain.food,
          categories: plain.food.categories.map(({ name }) => name),
        },
      };
    });

    return {
      eatLogs,
      totalCount: count,
    };
  }

  async findEatLogByUserIdAndFoodId(userId: string, foodId: string) {
    const eatlog = await this.eatLogModel.findOne({
      where: {
        [Op.and]: {
          userId,
          foodId,
        },
      },
    });
    return eatlog;
  }

  async createOrUpdateEatLog(
    userId: string,
    { foodId, eatDate, description }: CreateOrUpdateEatLogDto,
  ) {
    await this.foodsService.findById(foodId);
    const eatLog = await this.findEatLogByUserIdAndFoodId(userId, foodId);
    if (!eatLog) {
      await this.eatLogModel.create({
        eatDate,
        description,
        userId,
        foodId,
      });
    } else {
      await eatLog.update({
        eatDate,
        description,
      });
    }
  }

  async deleteEatLog(userId: string, foodId: string) {
    await this.foodsService.findById(foodId);
    const eatLog = await this.findEatLogByUserIdAndFoodId(userId, foodId);
    if (!eatLog) {
      throw new CustomException(404, 40402);
    }
    await eatLog.destroy();
  }
}
