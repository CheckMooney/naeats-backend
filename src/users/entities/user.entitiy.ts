import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Unique, IsEmail, IsUrl } from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';

@Table
export class User extends BaseModel {
  @ApiProperty()
  @IsEmail
  @Unique
  @Column
  email: string;

  @ApiProperty()
  @Column
  username: string;

  @ApiProperty()
  @IsUrl
  @Column
  profileImg: string;
}
