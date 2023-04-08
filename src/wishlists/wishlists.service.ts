import {
	BadRequestException,
	Injectable,
	NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { In, Repository } from 'typeorm';
  import { CreateWishlistDto } from './dto/create-wishlist.dto';
  import { UpdateWishlistDto } from './dto/update-wishlist.dto';
  import { Wishlist } from './entities/wishlist.entity';
  import { User } from 'src/users/entities/user.entity';
  import { WishesService } from 'src/wishes/wishes.service';
  
  @Injectable()
  export class WishlistsService {
	constructor(
	  @InjectRepository(Wishlist)
	  private wishListRepository: Repository<Wishlist>,
	  private wishesService: WishesService,
	) {}
  
	async create(user: User, wishlist: CreateWishlistDto) {
	  const newWishes = await this.wishesService.find({
		where: { id: In(wishlist.itemsId || []) },
	  });
	  const newWishList = await this.wishListRepository.create({
		...wishlist,
		owner: user,
		items: newWishes,
	  });
	  return await this.wishListRepository.save(newWishList);
	}
  
	findAll() {
	  return this.wishListRepository.find({ relations: ['owner', 'items'] });
	}
  
	findOne(id: number) {
	  return this.wishListRepository.findOne({
		where: { id },
		relations: ['owner', 'items'],
	  });
	}
  
	async update(
	  wishListId: number,
	  wishlistDto: UpdateWishlistDto,
	  userId: number,
	) {
	  const wishList = await this.findOne(wishListId);
	  if (!wishList) throw new NotFoundException('Такого списка не существует');
	  if (wishList.owner.id !== userId)
		throw new BadRequestException('Нельзя изменять чужие списки');
  
	  const newWishes = await this.wishesService.find({
		where: { id: In(wishlistDto.itemsId || []) },
	  });
	  const updatedWishList = {
		...wishList,
		name: wishlistDto.name,
		image: wishlistDto.image,
		items: newWishes,
	  };
	  return await this.wishListRepository.save(updatedWishList);
	}
  
	async remove(wishListId: number, userId: number) {
	  const wishList = await this.findOne(wishListId);
	  if (!wishList) throw new NotFoundException('Такого списка не существует');
	  if (wishList.owner.id !== userId)
		throw new BadRequestException('Нельзя удалять чужие списки');
	  await this.wishListRepository.delete(wishListId);
	  return wishList;
	}
  }