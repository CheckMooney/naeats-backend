import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import {
  Column,
  ForeignKey,
  Table,
  DataType,
  Default,
} from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entitiy';
import { Food } from './food.entity';

@Table
export class UserLikeFood extends BaseModel {
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => Food)
  @Column
  foodId: string;

  @ApiProperty({ description: '싫어요 여부' })
  @Default(false)
  @IsNumber()
  @Column(DataType.BOOLEAN)
  isDislike: boolean;
}
