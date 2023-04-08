import { 
  BadRequestException, 
  Controller, 
  Post, 
  UseGuards, 
  Req, 
  Body 
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/localAuth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    // Генерируем для пользователя JWT-токен
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    // При регистрации создаём пользователя и генерируем для него токен

    const isEmailExist = await this.userService.findByEmail(
      createUserDto.email,
    );

    const isUsernameExist = await this.userService.findUserForAuth(
      createUserDto.username,
    );

    if (isEmailExist || isUsernameExist) {
      throw new BadRequestException('Такой пользователь уже существует');
    }

    const user = await this.userService.create(createUserDto);

    return this.authService.auth(user);
  }
}