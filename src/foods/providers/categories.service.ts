import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../entities';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
  ) {}

  async findAll(): Promise<string[]> {
    const caterories = await this.categoryModel.findAll();
    return caterories.map((category) => category.name);
  }

  async findOrCreate(name: string): Promise<Category> {
    const [category] = await this.categoryModel.findOrCreate({
      where: { name },
    });
    return category;
  }
}
