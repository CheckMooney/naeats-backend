import { google, Auth as GoogleAuth } from 'googleapis';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entitiy';
import { CustomException } from 'src/common/exceptions/custom.exception';

@Injectable()
export class AuthService {
  googleOAuth2Client: GoogleAuth.OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.googleOAuth2Client = new google.auth.OAuth2({
      clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_CLINET_SECRET'),
    });
  }

  getJwtAccessToken(userId: string) {
    const payload = {
      userId,
      iss: 'na-eats',
      sub: 'accessToken',
    };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async getJwtRefreshToken(userId: string) {
    const payload = {
      userId,
      iss: 'na-eats',
      sub: 'refreshToken',
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });
    await this.usersService.setRefreshToken(userId, refreshToken);
    return refreshToken;
  }

  async verifyGoogleIdToken(idToken: string): Promise<GoogleAuth.TokenPayload> {
    try {
      const loginTicket = await this.googleOAuth2Client.verifyIdToken({
        idToken,
      });
      const { payload } = loginTicket.getAttributes();
      return payload;
    } catch (error) {
      throw new CustomException(HttpStatus.UNAUTHORIZED, 40103);
    }
  }

  async logInWithGoogleIdToken(idToken: string): Promise<User> {
    const { email, picture, name } = await this.verifyGoogleIdToken(idToken);
    const user = await this.usersService.createUser(email, name, picture);
    return user;
  }

  async logOut(userId: string) {
    await this.usersService.deleteRefreshToken(userId);
  }
}
