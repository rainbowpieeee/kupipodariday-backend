import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils/hash';
import { FindUserDto } from './dto/find-user.dto';
import { PublicUserDto } from './dto/public-user.dto';

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
    return this.userRepository.findOneBy({ id });
  } 

  async findByUserName(username: string):Promise<User> {
    const user = await this.userRepository.findOneBy({username});   
    if (!user) {
      throw new NotFoundException('Пользователь с таким именем в базе не найден');
    } 
    return user;
  } 

  async findByUserNamePublic(username: string):Promise<PublicUserDto> {
    const user = await this.userRepository.findOneBy({username});   
    if (!user) {
      throw new NotFoundException('Пользователь с таким именем в базе не найден');
    } 
    return PublicUserDto.getFromUser(user);
  } 

  async findMany({ query }: FindUserDto): Promise<PublicUserDto[]> {
    const users = await this.userRepository.find({where: [{email: query}, {username: query}]})

    if (!users) {
      throw new NotFoundException();
    } 

    return users.map((user) => PublicUserDto.getFromUser(user));
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
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

    if (!user) {
      throw new NotFoundException('Пользователь в базе не найден');
    } 

    return user.wishes;
  }

  async remove(id: number) {
    const deletedUser = await this.findOne(id);
    await this.userRepository.delete(id);
    return deletedUser;
  }
}