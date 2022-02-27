import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserLikeFood } from '../entities';

@Injectable()
export class UserLikeFoodService {
  constructor(
    @InjectModel(UserLikeFood)
    private readonly userLikeFoodModel: typeof UserLikeFood,
  ) {}

  async isUserLikeFoodExist(
    userId: string,
    foodId: string,
  ): Promise<UserLikeFood | null> {
    const userLikeFood = await this.userLikeFoodModel.findOne({
      where: { userId, foodId },
    });
    return userLikeFood;
  }

  async createUserLikeFood(userId: string, foodId: string): Promise<void> {
    await this.userLikeFoodModel.create({
      userId,
      foodId,
    });
  }

  async userLikeOrDislikeFood(userId: string, foodId: string): Promise<void> {
    const userLikeFood = await this.isUserLikeFoodExist(userId, foodId);
    if (userLikeFood) {
      await userLikeFood.destroy();
    } else {
      await this.createUserLikeFood(userId, foodId);
    }
  }
}
