import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
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
	//TODO если имя вводить не верно выводит error: Cannot read properties of null (reading 'password')
    const user = await this.userService.findByUserName(username);

     /* В идеальном случае пароль обязательно должен быть захэширован */
    const passwordIsCompare = await bcrypt.compare(password, user.password);

    if (user && passwordIsCompare) {
      /* Исключаем пароль из результата */
      const {password, ...result} = user;
      return result;
    }
    return null;
  }
}
