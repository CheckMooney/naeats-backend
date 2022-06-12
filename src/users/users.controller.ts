import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entitiy';
import { ExceptionResponse } from 'src/common/responses/exception.response';
import { GetProfileResponse } from './responses';
import { ApiAuth } from 'src/docs/decorators';

@ApiTags('Users')
@ApiAuth('AccessToken')
@UseGuards(JwtAccessGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ description: '내 프로필 가져오기' })
  @ApiResponse({
    status: 200,
    type: GetProfileResponse,
  })
  @ApiResponse({ status: 401, type: ExceptionResponse })
  getProfile(@AuthUser() user: User) {
    const { id, email, username, profileImg } = user;
    return {
      statusCode: 200,
      profile: { id, email, username, profileImg },
    };
  }
}
