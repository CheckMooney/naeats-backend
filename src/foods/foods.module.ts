import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food } from './entities/food.entity';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';

@Module({
  imports: [SequelizeModule.forFeature([Food])],
  providers: [FoodsService],
  controllers: [FoodsController],
})
export class FoodsModule {}
