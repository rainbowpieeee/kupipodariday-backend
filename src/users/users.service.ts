import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create({
      ...createUserDto,
      password: await this.hashService.hash(createUserDto.password),
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });
    const { password, ...result } = user;
    return result;
  }

  async findUserForAuth(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['password'],
    });
    return user;
  }

  async findUserByName(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    const { password, ...rest } = user;
    return rest;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async findBy(query: string): Promise<User> {
    const emailReg =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let user;
    if (emailReg.test(query)) {
      user = await this.userRepository.findOne({
        where: { email: query },
      });
    } else
      user = await this.userRepository.findOne({
        where: { username: query },
      });
    if (!user) throw new NotFoundException('Ничего не найдено');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPass = await this.hashService.hash(updateUserDto.password);
      updateUserDto.password = hashedPass;
    }
    await this.userRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async getUserWishes(id: number) {
    const { wishes } = await this.userRepository.findOne({
      where: { id },
      select: ['wishes'],
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });
    for (const wish of wishes) {
      delete wish.owner.password;
      delete wish.owner.email;
    }
    return wishes;
  }
}