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

  async createUserLikeFood(
    userId: string,
    foodId: string,
    isDislike?: boolean,
  ): Promise<void> {
    await this.userLikeFoodModel.create({
      userId,
      foodId,
      isDislike: Boolean(isDislike),
    });
  }

  async userLikeOrDislikeFood(
    userId: string,
    foodId: string,
    isDislike: boolean,
  ): Promise<any> {
    const userLikeFood = await this.isUserLikeFoodExist(userId, foodId);
    if (userLikeFood) {
      await userLikeFood.destroy();
    } else {
      await this.createUserLikeFood(userId, foodId, isDislike);
    }
    // return !userLikeFood;
    return {
      isLike: !userLikeFood && !isDislike,
      isDisLike: !userLikeFood && isDislike,
    };
  }
}
