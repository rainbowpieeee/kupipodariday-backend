import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils/hash';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	  ) {}
	
	  async create(createUserDto: CreateUserDto): Promise<User> {
		const { password, ...result} = createUserDto;
    	const hash = await hashPassword(password);
    	return this.userRepository.save({password: hash, ...result});
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    //console.log('id in find one', id);
    return this.userRepository.findOneBy({ id });
  } //TODO не возвращать пароль в виде хэша
  

  async findByUserName(username: string): Promise<User> {
    //console.log('Username', username);
    const user = await this.userRepository.findOneBy({username});
    //console.log('user info', user);
    /*if (!user) {
      return new NotFoundException();
    }*/
    return user;
  } 
  
  async findMany({ query }: FindUserDto): Promise<User[]> {
    //console.log('', { query });
    const users = await this.userRepository.find({where: [{email: query}, {username: query}]})
    return users;
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    //console.log('id in update service', id);
    //console.log('data in update service', updateUserDto);
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }
 //public
  async updateUserData(id: number, updateUserDto: UpdateUserDto) {
    
    const { password } = updateUserDto;    
    if (password) {
      return this.userRepository.update(id, {...updateUserDto, password: await hashPassword(password),
      });
    } else return this.userRepository.update(id, updateUserDto)
  }

  async getUserWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: {username: username},
      select: ['wishes'],
      relations: ['wishes']
    })
    //console.log('Wishes in userwishes', user.wishes);
    return user.wishes;
  }

  async remove(id: number) {
    const deletedUser = await this.findOne(id);
    await this.userRepository.delete(id);
    return deletedUser;
  }
}