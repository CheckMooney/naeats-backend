import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, Length } from 'class-validator';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';
import { Food } from 'src/foods/entities';
import { User } from 'src/users/entities/user.entitiy';

@Table
export class EatLog extends BaseModel {
  @ApiProperty({ description: '먹은 날짜' })
  @IsDate()
  @Column({
    type: DataType.DATE,
  })
  eatDate: Date;

  @ApiProperty({ description: '설명 또는 메모' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @ApiProperty({ description: '사용자 ID' })
  @ForeignKey(() => User)
  @IsString()
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @ApiProperty({ description: '음식 ID' })
  @ForeignKey(() => Food)
  @IsString()
  @Column({
    type: DataType.UUID,
  })
  foodId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Food)
  food: User;
}
