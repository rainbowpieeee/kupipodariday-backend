import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  //TODO если имя вводить не верно выводит error: Cannot read properties of null (reading 'password')
  async validate(username: string, password: string) {
    const user = await this.authService.validatePassword(username, password);

    if (!user) {
		throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    return user;
  }
}
