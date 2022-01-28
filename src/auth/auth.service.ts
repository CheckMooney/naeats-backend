import { google, Auth as GoogleAuth } from 'googleapis';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entitiy';
import { JwtTokenPayload } from 'src/@types';

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
    const payload: JwtTokenPayload = {
      userId,
      iss: 'na-eats',
      sub: 'accessToken',
    };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  getJwtRefreshToken(userId: string) {
    const payload: JwtTokenPayload = {
      userId,
      iss: 'na-eats',
      sub: 'refreshToken',
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });
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
      throw new UnauthorizedException();
    }
  }

  async signInWithGoogleIdToken(idToken: string): Promise<User> {
    const { email, picture, name } = await this.verifyGoogleIdToken(idToken);
    const user = await this.usersService.createUser({
      email,
      username: name,
      profileImg: picture,
    });
    return user;
  }
}
