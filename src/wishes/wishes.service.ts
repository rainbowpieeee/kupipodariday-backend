import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User) {
    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: owner,
    });
    return wish;
  }

  async findAll(options?: any) {
    return this.wishesRepository.find(options);
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: { wishes: true, wishList: true, offers: true },
        offers: { user: true },
      },
    });

    return wish;
  }

  async remove(id: number) {
    const deletedWish = await this.findOne(id);
    await this.wishesRepository.delete(id);
    return deletedWish;
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<any> {
    await this.wishesRepository.update(id, updateWishDto);
    return this.findOne(id);
  }
}