import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Unique,
  IsEmail,
  IsUrl,
  AllowNull,
  BeforeUpdate,
  Default,
} from 'sequelize-typescript';
import { BaseModel } from 'src/common/entities/base.entity';
import { InternalServerErrorException } from '@nestjs/common';

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

  @AllowNull
  @Default(null)
  @Column
  hashedRefreshToken?: string;

  @BeforeUpdate
  static async hashRefreshToken(instance: User, { fields }: any) {
    try {
      if (
        instance.hashedRefreshToken &&
        fields.includes('hashedRefreshToken')
      ) {
        instance.hashedRefreshToken = await bcrypt.hash(
          instance.hashedRefreshToken,
          10,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async compareRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      if (!this.hashedRefreshToken) {
        return false;
      }
      const result = await bcrypt.compare(
        refreshToken,
        this.hashedRefreshToken,
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
