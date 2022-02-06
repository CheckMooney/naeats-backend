import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entitiy';
import { GetProfileResponse } from './dtos/get-profile.dto';
import { ExceptionResponse } from 'src/common/responses/exception.response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAccessGuard)
  @Get()
  @ApiOperation({ description: '내 프로필 가져오기 (Access Token Needed)' })
  @ApiBearerAuth('Access Token')
  @ApiResponse({ status: 200, type: GetProfileResponse })
  @ApiResponse({ status: 401, type: ExceptionResponse })
  getProfile(@AuthUser() user: User) {
    const { id, email, username, profileImg } = user;
    return { id, email, username, profileImg };
  }
}
