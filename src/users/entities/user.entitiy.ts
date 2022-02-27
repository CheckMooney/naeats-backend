import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';
import { IsEmail, IsString, IsUrl } from 'class-validator';

@Table
export class User extends BaseModel {
  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  @Column({
    type: DataType.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @ApiProperty({ description: '사용자 이름' })
  @IsString()
  @Column({
    type: DataType.STRING,
  })
  username: string;

  @ApiProperty({ description: '사용자 프로필 이미지' })
  @IsUrl()
  @Column({
    type: DataType.STRING,
    validate: {
      isUrl: true,
    },
  })
  profileImg: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
    set(this: User, refreshToken: string | null) {
      if (refreshToken) {
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
        this.setDataValue('hashedRefreshToken', hashedRefreshToken);
      } else {
        this.setDataValue('hashedRefreshToken', null);
      }
    },
  })
  @IsString()
  hashedRefreshToken: string | null;

  compareRefreshToken(refreshToken: string): boolean {
    if (!this.hashedRefreshToken) {
      return false;
    }
    const result = bcrypt.compareSync(refreshToken, this.hashedRefreshToken);
    return result;
  }
}
