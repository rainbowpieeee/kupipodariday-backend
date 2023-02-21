import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
	private jwtService: JwtService
  ) {}

  auth(user: User): { access_token: string} {
    // тут будем генерировать токен
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {    
    const user = await this.userService.findByUserName(username);

    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль')
    }
    const passwordIsCompare = await bcrypt.compare(password, user.password);    

    if (!passwordIsCompare) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль')
    }

    if (user && passwordIsCompare) {
      /* Исключаем пароль из результата */
      const {password, ...result} = user;
      return result;
    }
    return null;
  }
}
