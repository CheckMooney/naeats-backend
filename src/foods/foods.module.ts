import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FoodsController } from './foods.controller';
import {
  FoodsService,
  CategoriesService,
  UserLikeFoodService,
} from './services';
import { Food, Category, FoodCategory, UserLikeFood } from './entities';

@Module({
  imports: [
    SequelizeModule.forFeature([Food, Category, FoodCategory, UserLikeFood]),
  ],
  providers: [CategoriesService, FoodsService, UserLikeFoodService],
  controllers: [FoodsController],
})
export class FoodsModule {}
