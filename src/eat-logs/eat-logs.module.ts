import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { FoodsModule } from 'src/foods/foods.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { EatLog } from './entities/eat-log.entity';
import { EatLogsService } from './eat-logs.service';
import { EatLogsController } from './eat-logs.controller';

@Module({
  imports: [SequelizeModule.forFeature([EatLog]), UsersModule, FoodsModule],
  providers: [EatLogsService],
  controllers: [EatLogsController],
})
export class EatLogsModule {}
