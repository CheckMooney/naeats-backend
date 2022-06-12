import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import {
  Table,
  Column,
  DataType,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';
import { EatLog } from 'src/eat-logs/entities/eat-log.entity';
import { User } from 'src/users/entities/user.entitiy';
import { Category } from './category.entity';
import { FoodCategory } from './food-category.entitiy';
import { UserLikeFood } from './user-like-food';

@Table
export class Food extends BaseModel {
  @ApiProperty({ description: '음식 이름' })
  @IsString()
  @Column(DataType.STRING)
  name: string;

  @ApiProperty({ description: '음식 썸네일' })
  @IsUrl()
  @Column({ type: DataType.STRING, validate: { isUrl: true } })
  thumbnail: string;

  @ApiProperty({ description: '음식 카테고리' })
  @BelongsToMany(() => Category, () => FoodCategory)
  categories: Array<Category & { FoodCategory: FoodCategory }>;

  @ApiProperty()
  @BelongsToMany(() => User, () => UserLikeFood)
  likeUsers: Array<User & { UserLikeFood: UserLikeFood }>;

  @HasMany(() => UserLikeFood)
  UserLikeFood: UserLikeFood[];

  //for sequelize literal query
  isLike: boolean;
  
  @HasMany(() => EatLog, { as: 'eatlogs' })
  eatLogs: EatLog[];
}
