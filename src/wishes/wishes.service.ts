import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicUserDto } from 'src/users/dto/public-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,   
    private readonly userService: UsersService
  ) {}

  async create(createWishDto: CreateWishDto, owner: User) {
    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: PublicUserDto.getFromUser(owner),
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
        owner: { wishes: true, wishlists: true, offers: true },
        offers: { user: true },
      },
    });

	if (!wish) {
		throw new NotFoundException();
	  }

    return wish;
  }

  async remove(id: number) {
    const deletedWish = await this.findOne(id);

	if (!deletedWish) {
		throw new NotFoundException();
	  }

    await this.wishesRepository.delete(id);
    return deletedWish;
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<any> {
    await this.wishesRepository.update(id, updateWishDto);
    return this.findOne(id);
  }

  async updateOne(idWish: number, userId: number, updateWishDto: UpdateWishDto) {
    const updatingWish = await this.findOne(idWish);

    if (!updatingWish) {
      throw new NotFoundException();
    }

    const currentUser = await this.userService.findOne(userId);

    if (updatingWish.owner.id !== currentUser.id) {
      throw new ForbiddenException('Можно редактировать только свои желания')    
    }

    if (updatingWish.offers && updatingWish.offers.length > 0) {
      throw new ForbiddenException('Стоимость желания менять нельзя, т.к. заявки от жалающих скинуться')
    }

    await this.update(idWish, updateWishDto);
    return updateWishDto;
  }

  async findLastWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({ take: 40, order: { createdAt: 'DESC'}});
  }

  async findTopWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({  take: 10, order: { copied: 'DESC'}}) // 10 in check list
  }

  async copyLikedWish(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);

	if (!wish) {
		throw new NotFoundException();
	  }

    const wishCopyCounter = wish.copied++;
    await this.wishesRepository.update(wishId, {
      copied: wishCopyCounter
    });


    const currentUser = await this.userService.findOne(userId);

    const copiedWish = {
      ...wish,
      owner: PublicUserDto.getFromUser(currentUser),
      copied: 0,
      raised: 0,
      offers: []
    }

    delete copiedWish.id; // to create sa copy, otherwice rewrite the original
    const createCopiedWish = await this.create(copiedWish, currentUser);

    return createCopiedWish;
  }

  async find(options: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find(options)
  }
}