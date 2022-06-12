import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';
import { FoodCategory } from './food-category.entitiy';
import { Food } from './food.entity';

@Table
export class Category extends BaseModel {
  @ApiProperty({ description: '음식 카테고리 이름' })
  @IsString()
  @Column(DataType.STRING)
  name: string;

  @BelongsToMany(() => Food, () => FoodCategory)
  foods: Array<Food & { FoodCategory: FoodCategory }>;
}
