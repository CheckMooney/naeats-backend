import { Column, ForeignKey, Table } from 'sequelize-typescript';
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
}
