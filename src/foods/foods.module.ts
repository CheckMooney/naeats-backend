import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food } from './entities/food.entity';
import { CategoriesService, FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { Category } from './entities/category.entity';
import { FoodCategory } from './entities/food-category.entitiy';

@Module({
  imports: [SequelizeModule.forFeature([Food, Category, FoodCategory])],
  providers: [FoodsService, CategoriesService],
  controllers: [FoodsController],
})
export class FoodsModule {}
