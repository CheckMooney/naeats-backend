import { Table, Column, ForeignKey } from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';
import { Category } from './category.entity';
import { Food } from './food.entity';

@Table
export class FoodCategory extends BaseModel {
  @ForeignKey(() => Food)
  @Column
  foodId: string;

  @ForeignKey(() => Category)
  @Column
  categoryId: string;
}
