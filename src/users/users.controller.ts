import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOne(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('me/wishes')
  async getCurrentUserWishes(@Req() req) {
    return this.usersService.getUserWishes(req.user.id);
  }

  @Get(':username')
  async getUserByName(@Param() param) {
    const user = await this.usersService.findUserByName(param.username);
    return user;
  }

  @Get(':username/wishes')
  async getUserWishes(@Param() param) {
    const user = await this.usersService.findUserByName(param.username);
    const userWishes = await this.usersService.getUserWishes(user.id);
    return userWishes;
  }

  @Patch('me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('find')
  async findUser(@Body() dto: { query: string }) {
    const user = await this.usersService.findBy(dto.query);
    return [user];
  }
}
