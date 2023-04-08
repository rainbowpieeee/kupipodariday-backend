import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
	  private usersService: UsersService,
	  private configService: ConfigService,
	) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtSecret',
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = this.usersService.findOne(jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}