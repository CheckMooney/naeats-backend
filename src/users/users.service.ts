import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entitiy';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { id: userId } });
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.userModel.findOne({ where: { email } });
    return user;
  }

  async createUser({
    email,
    username,
    profileImg,
  }: CreateUserDto): Promise<User> {
    const user = await this.findByEmail(email);
    if (user) {
      return user;
    }
    const newUser = await this.userModel.create({
      email,
      username,
      profileImg,
    });
    return newUser;
  }
}
