import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
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
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user: User): Promise<Wishlist> {    
    //console.log('user in wishlist', user);
    const wishes = await this.wishesService.find({
      where: { id: In(createWishlistDto.itemId || [])},
    });

    const wishList = this.wishListRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes      
    });

    //console.log('new wishList', wishList);
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

  async update(id: number, updateWishlistDto: UpdateWishlistDto): Promise<any> {
    return this.wishListRepository.update(id, updateWishlistDto);
  }

  async removeOne(wishListId: number) {
    const wishListToDelete = await this.findOne(wishListId);

    if (!wishListToDelete) {
      throw new NotFoundException();
    }    

    await this.wishListRepository.delete(wishListId);

    return wishListToDelete;
  }
}