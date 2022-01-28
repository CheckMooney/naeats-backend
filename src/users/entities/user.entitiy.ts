import { Table, Column, Unique, IsEmail, IsUrl } from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';

@Table
export class User extends BaseModel {
  @IsEmail
  @Unique
  @Column
  email: string;

  @Column
  username: string;

  @IsUrl
  @Column
  profileImg: string;
}
