import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entitiy';
import { AuthUser } from './decorators/auth-user.decorator';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GoogleAuthDto, GoogleAuthResponse } from './dtos/google-auth.dto';
import { ExceptionResponse } from 'src/common/responses/exception.response';
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @ApiOperation({
    description:
      'Google Id Token을 사용하여 가입에 사용된 이메일이 없다면 사용자를 만들고 Access Token과 Refresh Token 발급',
  })
  @ApiResponse({
    status: 201,
    description: 'Access Token과 Refresh Token 발급',
    type: GoogleAuthResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Google Id Token is invalid.',
    type: ExceptionResponse,
  })
  async logInWithGoogleIdToken(@Body() { idToken }: GoogleAuthDto) {
    const user = await this.authService.logInWithGoogleIdToken(idToken);
    const accessToken = this.authService.getJwtAccessToken(user.id);
    const refreshToken = await this.authService.getJwtRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiOperation({
    description: 'Refresh Token으로 AccessToken 재발급',
  })
  @ApiBearerAuth('Refresh Token')
  @ApiResponse({
    status: 200,
    description: 'Access Token 재발급.',
    type: GoogleAuthResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh Token is invalid or expired',
    type: ExceptionResponse,
  })
  async refresh(@AuthUser() user: User) {
    const accessToken = this.authService.getJwtAccessToken(user.id);
    return {
      accessToken,
    };
  }

  @UseGuards(JwtAccessGuard)
  @Post('logout')
  @ApiOperation({
    description: 'RefreshToken을 삭제함으로 로그아웃',
  })
  async logout(@AuthUser() user: User) {
    await this.authService.logOut(user.id);
  }
}
