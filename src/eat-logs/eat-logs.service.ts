import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { Food } from 'src/foods/entities';
import { FoodsService } from 'src/foods/providers';
import { User } from 'src/users/entities/user.entitiy';
import { UsersService } from 'src/users/users.service';
import { CreateEatLogDto, UpdateEatLogDto } from './dtos';
import { EatLog } from './entities/eat-log.entity';

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

  async getEatLog(userId: string, eatLogId: string) {
    const eatLog = await this.eatLogModel.findOne({
      attributes: ['id', 'eatDate', 'description'],
      where: {
        id: eatLogId,
      },
      include: [
        {
          model: Food,
          attributes: ['id', 'name', 'thumbnail'],
        },
        {
          model: User,
          attributes: [],
          where: {
            id: userId,
          },
        },
      ],
    });
    if (!eatLog) {
      throw new CustomException(404, 40402);
    }
    return eatLog;
  }

  async getEatLogs(userId: string) {
    const eatLogs = await this.eatLogModel.findAll({
      attributes: ['id', 'eatDate', 'description'],
      include: [
        {
          model: Food,
          attributes: ['id', 'name', 'thumbnail'],
        },
        {
          model: User,
          attributes: [],
          where: {
            id: userId,
          },
        },
      ],
    });
    return eatLogs;
  }

  async createEatLog(
    userId: string,
    { foodId, eatDate, description }: CreateEatLogDto,
  ) {
    await this.foodsService.findById(foodId);
    await this.eatLogModel.create({
      eatDate,
      description,
      userId,
      foodId,
    });
  }

  async updateEatLog(eatLogId: string, updateEatLogDto: UpdateEatLogDto) {
    const eatLog = await this.findById(eatLogId);
    await eatLog.update({
      ...updateEatLogDto,
    });
  }

  async deleteEatLog(eatLogId: string) {
    const eatLog = await this.findById(eatLogId);
    await eatLog.destroy();
  }
}
