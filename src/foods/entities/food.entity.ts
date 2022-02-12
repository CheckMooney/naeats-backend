import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUrl } from 'class-validator';
import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';
import { FoodCategory } from '../enums/food-category.enum';

@Table
export class Food extends BaseModel {
  @ApiProperty()
  @IsString()
  @Column(DataType.STRING)
  name: string;

  @ApiProperty()
  @IsEnum(FoodCategory)
  @Column(DataType.ENUM({ values: Object.keys(FoodCategory) }))
  category: FoodCategory;

  @ApiProperty()
  @IsUrl()
  @Column({ type: DataType.STRING, validate: { isUrl: true } })
  thumbnail: string;
}
