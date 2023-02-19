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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
*/
  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }*/

  // Get Current User
 @UseGuards(JwtGuard)
 @Get('me')
 findCurrentUser(@Req() req):Promise<User> {
   console.log('req.user', req.user); 
   return null;//this.usersService.findOne(req.user.id);
 }

 // Update User Info
 @UseGuards(JwtGuard)
 @Patch('me')
 update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
   return this.usersService.updateUserData(+req.user.id, updateUserDto);
 }

 @Delete(':id')
 remove(@Param('id') id: string) {
   return this.usersService.remove(+id);
 }

 /*@Post('find')
 findMany(@Body()) {
   return this.usersService.findMany();
 }*/


}