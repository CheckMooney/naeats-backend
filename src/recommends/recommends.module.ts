import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food } from 'src/foods/entities';
import { FoodsModule } from 'src/foods/foods.module';
import { RecommendsService } from './recommends.service';
import { RecommendsController } from './recommends.controller';
import { EatLogsModule } from 'src/eat-logs/eat-logs.module';

@Module({
  imports: [SequelizeModule.forFeature([Food]), FoodsModule, EatLogsModule],
  providers: [RecommendsService],
  controllers: [RecommendsController],
})
export class RecommendsModule {}
