import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicUserDto } from 'src/users/dto/public-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
	private readonly userService: UsersService
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user: User): Promise<Wishlist> {    
    const wishes = await this.wishesService.find({
		where: { id: In(createWishlistDto.itemsId || [])},
    });

    const wishList = this.wishListRepository.create({
      ...createWishlistDto,
      owner: PublicUserDto.getFromUser(user),
      items: wishes            
    });

    return this.wishListRepository.save(wishList);
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishListRepository.find({relations: 
      ['items', 'owner']
    });
  }

  findOne(id: number): Promise<Wishlist> {
    return this.wishListRepository.findOne({
      where: { id },
      relations: ['items', 'owner']
    })
  }

  async updateOne(idWishlist: number, userId: number, updateWishlistDto: UpdateWishlistDto) {
    const updatingWishList = await this.findOne(idWishlist);

    if (!updatingWishList) {
      throw new NotFoundException();
    }

    const currentUser = await this.userService.findOne(userId);

    if (updatingWishList.owner.id !== currentUser.id) {
      throw new ForbiddenException('Можно редактировать только свой вишлист')    
    }

    const wishes = await this.wishesService.find({
      where: { id: In(updateWishlistDto.itemsId || [])},
    });

    const updatedWishlist = await {
      ...updateWishlistDto,
      id: idWishlist,
      updatedAt: new Date(),      
      items: wishes,
    };

    await delete updatedWishlist.itemsId;   

    return this.wishListRepository.save(updatedWishlist);
  }

  async removeOne(wishListId: number): Promise<Wishlist> {
    const wishListToDelete = await this.findOne(wishListId);

    if (!wishListToDelete) {
      throw new NotFoundException();
    }    

    await this.wishListRepository.delete(wishListId);

    return wishListToDelete;
  }
}