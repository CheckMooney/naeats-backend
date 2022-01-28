import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entitiy';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAccessGuard)
  @Get()
  async getUserProfile(@AuthUser() user: User) {
    const { id, email, username, profileImg } = user;
    return { id, email, username, profileImg };
  }
}
