import { ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { CustomException } from 'src/common/exceptions/custom.exception';

@Injectable()
export class JwtAcessStrategy extends PassportStrategy(
  JwtStrategy,
  'jwt-access',
) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    const userId = this.validatePayload(payload);
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new CustomException(HttpStatus.UNAUTHORIZED, 40101);
    }
    return user;
  }
}
