import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils/hash';

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
    console.log('id in find one', id);
    return this.userRepository.findOneBy({ id: id });
  }

  async findByUserName(username: string): Promise<User> {
    return this.userRepository.findOneBy({username})
  }
  
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async updateUserData(id: number, updateUserDto: UpdateUserDto) {

    const { password } = updateUserDto;    
    if (password) {
      return this.userRepository.update(id, {...updateUserDto, password: await hashPassword(password),
      });
    } else return this.userRepository.update(id, updateUserDto)
  }
  
  async remove(id: number) {
    const deletedUser = await this.findOne(id);
    await this.userRepository.delete(id);
    return deletedUser;
  }
}

/*
Для каждого сервиса должны быть методы:
    создания (create),
    поиска по условию одной (findOne) или нескольких записей,
    обновления (updateOne) для одной записи,
    удаления (removeOne) для одной записи.
*/