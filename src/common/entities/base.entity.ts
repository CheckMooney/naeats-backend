import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class BaseModel extends Model {
  @ApiProperty({ description: 'id' })
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;
}
