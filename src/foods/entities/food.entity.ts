import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import { Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';
import { Category } from './category.entity';
import { FoodCategory } from './food-category.entitiy';

@Table
export class Food extends BaseModel {
  @ApiProperty()
  @IsString()
  @Column(DataType.STRING)
  name: string;

  @ApiProperty()
  @IsUrl()
  @Column({ type: DataType.STRING, validate: { isUrl: true } })
  thumbnail: string;

  @BelongsToMany(() => Category, () => FoodCategory)
  categories: Array<Category & { FoodCategory: FoodCategory }>;
}
