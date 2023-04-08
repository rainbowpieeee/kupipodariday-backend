import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/hash/hash.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, pass: string) {
    const user = await this.usersService.findUserForAuth(username);

    if ( !user || !this.hashService.compare(pass, user.password)) {
	  throw new UnauthorizedException('Неправильный логин или пароль');
	}
	const { password, ...result } = user;
	return result;
  }
}
