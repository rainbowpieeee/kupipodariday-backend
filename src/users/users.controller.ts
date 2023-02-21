import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
  	Req,
  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 // for signup
 @Post()
 create(@Body() createUserDto: CreateUserDto) {
   return this.usersService.create(createUserDto);
 }


 @Get()
 findAll() {
   return this.usersService.findAll();
 }

 // Get Current User
 @Get('me')
 findCurrentUser(@Req() req):Promise<User> {
	  // console.log('req.user', req.user); 
	  return this.usersService.findOne(req.user.id);
 }

 // Update User Info
 @Patch('me')
 async update(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersService.updateUserData(req.user.id, updateUserDto);
    return this.usersService.findOne(req.user.id);
  }

  @Get('me/wishes')
  async getCurrentUserWishes(@Req() req) {
    const user = await this.usersService.findOne(req.user.id);
    const userWishes = await this.usersService.getUserWishes(user.username);
    return userWishes;
  }

  // Find user by Username
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUserName(username);
  }

  @Get(':username/wishes')
  getUsersWishes(@Param('username') username: string) {
    return this.usersService.getUserWishes(username);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
// Find User by email or username, unguarded
  @Post('find')
  async findMany(@Body() findUsersDto: FindUserDto): Promise<User[]> {
    return this.usersService.findMany(findUsersDto);
  }
}