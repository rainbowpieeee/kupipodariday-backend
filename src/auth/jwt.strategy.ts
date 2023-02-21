import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      // Указываем, что токен будет передаваться в заголовке Authorization в формате Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Получаем секрет для подписи JWT токенов из конфигурации
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Метод validate должен вернуть данные пользователя
   * В JWT стратегии в качестве параметра метод получает полезную нагрузку из токена
   */

  async validate(jwtPayload: { sub: number }) {
	// console.log('sub number', jwtPayload.sub);
    /* В subject токена будем передавать идентификатор пользователя */
    const user = await this.userService.findOne(jwtPayload.sub);
    // console.log('user in jwt strategy', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
