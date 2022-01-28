import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entitiy';
import { AuthUser } from './decorators/auth-user.decorator';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GoogleIdTokenDto } from './dtos/google-id-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async signInWithGoogleIdToken(@Body() { idToken }: GoogleIdTokenDto) {
    const user = await this.authService.signInWithGoogleIdToken(idToken);
    const accessToken = this.authService.getJwtAccessToken(user.id);
    const refreshToken = this.authService.getJwtRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@AuthUser() user: User) {
    const accessToken = this.authService.getJwtAccessToken(user.id);
    return {
      accessToken,
    };
  }

  @Post('logout')
  async logout() {
    return;
  }
}
