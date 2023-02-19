import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './locale.guards';

@Controller('/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    /* При регистрации, создаём пользователя и генерируем для него токен */
    const user = await this.userService.create(createUserDto);    
    return this.authService.auth(user);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req): { access_token: string } {
	/* Генерируем для пользователя JWT токен */
	console.log('sign in', req.user);
    return this.authService.auth(req.user);
  }
}

/*
Теперь при запросе на /signup пользователь добавится в базу, а в ответ вернется JWT-токен для аутентификации. При запросе на /signin Passport.js проверит логин и пароль пользователя, и, если они валидные, в ответ также вернётся JWT токен.
*/